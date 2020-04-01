import driver from '../driver'

export const getFacilityList = async (ctx)=>{
    const session = driver.session()
    const res = await session.run('match (f:facility) return f.ssCode, f.ssName order by f.ssCode')
    ctx.body = res.records
    // console.log(res)
    session.close()
}

export const getConstList = async (ctx)=>{
    const session = driver.session()
    const res = await session.run('match (c:const) return id(c), c.constNum')
    ctx.body = res.records
    console.log(res)
    session.close()
}

export const getNodeList = async (ctx)=>{
    const labelPicker = {
        시설정의:'facility',
        법규:'const',
        시설한정조건: 'limitation',
        법규원문: 'rawLaw'
    }
    const filterColPicker = {
        facility: 'n.ho',
        const: 'n.law',
        limitation: '[(n)--(f:facility) | f.ssNum]',
        rawLaw: 'n.law'
    }
    // console.log(ctx.query)
    const label = labelPicker[ctx.query.label]
    const filterCol = filterColPicker[label]
    // console.log(filterCol)
    const session = driver.session()
    const res = await session.run(`match (n:${label}:active) return id(n), n._str, labels(n)[0], ${filterCol} order by n._str`)
    ctx.body = res.records
    // console.log(res)
    session.close()
}

export const getFacilityById = async (ctx)=>{
    const ssCode = ctx.query.id
    const session = driver.session()
    const res = await session.run(`match (f:facility) where f.ssCode = '${ssCode}' return f`)
    ctx.body = res.records
    // console.log(res)
    session.close()
}

export const getNodeById = async (ctx)=>{
    const nodeId = ctx.query.id
    const session = driver.session()
    const res = await session.run(`match (n:active) where id(n) = ${nodeId} return n`)
    ctx.body = res.records
    session.close()
}

export const getLinkedNodes = async (ctx)=>{
    const nodeId = ctx.query.id
    const session = driver.session()
    const res = await session.run(`match (n)--(l:active) where id(n) = ${nodeId} return id(l), l._str, labels(l)[0]`)
    ctx.body = res.records
    session.close()
}

export const searchFacilityByName = async (ctx)=>{
    const searchText = ctx.query.search
    const session = driver.session()
    let res
    if (searchText==='all') {
        res = await session.run(`match (f:facility:active) return f.ssNum, f._str order by f.ssNum`)
    } else {
        res = await session.run(`match (f:facility:active) where f.ssName contains '${searchText}' return f.ssNum, f._str order by f.ssNum`)
    }
    ctx.body = res.records
    session.close()
}
