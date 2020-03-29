import Router from 'koa-router'

import driver from '../driver'


const check = new Router()


const getAvailList = async (ctx)=>{
    const {landuse, jdName, spcLawList} = ctx.query
    // console.log(landuse)
    // console.log(jdName)
    // console.log(spcLawList)
    // console.log(JSON.parse(spcLawList))
    const session = driver.session()
    // facilityList = await session.run(`match (f:facility) return f._str as name, id(f) as id, [(f)--(c:const) where c.landuse='${landuse}' | c] as consts order by name`)
    const facilityList = await session.run(`match (f:facility) optional match (f)--(c:const) where c.landuse='${landuse}' with f._str as name, id(f) as id, c order by f.ssNum, c.chkPriority with name, id, c return name, id, collect(c) as consts`)
    // facilityList = facilityList.records
    // console.log(result)
    // result.forEach(rec=>{
    //     console.log()
    // })
    // console.log(result[1].get('id(f)').toInt())
    // console.log(result[1].get('id(f)').toNumber())
    // facilityList.forEach(async fac=>{
    //     const facId = fac.get('id(f)').toInt()
    //     const consts = await session.run(`match (f:facility) where id(f)=${facId} optional match (f)--(c:const) where c.landuse=${landuse} return c`)
    //     console.log(consts.records)
    //     result[facId] = consts
    // })
    // console.log(result)
    // a = 1
    let result = facilityList.records
    .map( f=>({
        name: f.get('name'),
        id: f.get('id').toInt(),
        consts: f.get('consts')
    }) )
    .map( f=>{
        let gukgye
        if (f.consts.length) {
            // if (f.consts.length===1 && f.consts[0].properties.law==='도시계획조례(서울)') {
            //     console.log(f.name)
            //     console.log(f.consts[0].properties)
            // }
            if (f.consts[0].properties.law==='국토계획법') {
                const gukgye_data = f.consts[0].properties
                if (gukgye_data.effect==='가능') {
                    gukgye = true
                } else {
                    gukgye = 'jorye'
                }
            } else {
                gukgye = false
            }
        } else {
            gukgye = false
        }
        return {...f, gukgye: gukgye}
    })
    .map( f=>{
        let jorye
        if (f.consts.length>1) {
            if (f.consts[1].properties.law==='도시계획조례(서울)') {
                const jorye_data = f.consts[1].properties
                if (jorye_data.effect==='가능') {
                    jorye = true
                } else {
                    console.log('?')
                }
            }
        } else {
            jorye = false
        }
        return {...f, jorye: jorye}
    } )

    if (jdName) {
        const jdConstList = await session.run(`match (f:facility) optional match (f)--(c:const) where c.jdName='${jdName}' with f, c order by f.ssNum return id(f), collect(c) as consts`)
        // console.log(jdList)
    
        result = result.map( (f, idx)=>{
            const jd = jdConstList.records[idx]
            let jidan
            if (jd.get('consts').length) {
                jidan = jd.get('consts')[0].properties.effect
                console.log(jidan)
            } else {
                jidan = false
            }
            return {...f, jidan: jidan}
        } )
    }

    let spcList = JSON.parse(spcLawList)
    if (spcList.length) {
        // spcList.forEach( async spcName=>{
        const spcName = spcList[0]
        const spcConstList = await session.run(`match (f:facility) optional match (f)--(c:const) where c.law='${spcName}' with f, c order by f.ssNum return id(f), collect(c) as consts`)
        
        result = result.map( (f, idx)=>{
            const spcConst = spcConstList.records[idx]
            let spc
            if (spcConst.get('consts').length) {
                spc = false
            } else {
                spc = true
            }

            return {...f, spc: spc}

        } )

        // } )
    }

    ctx.body = result
    session.close()
}


check.get('/get-avail-list', getAvailList)

export default check