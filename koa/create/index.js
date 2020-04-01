import Router from 'koa-router'
import KoaBody from "koa-body"

import driver from '../driver'

export const getFacilityList = async (ctx)=>{
    const session = driver.session()
    const res = await session.run('match (f:facility) return f.ssCode, f.ssName order by f.ssCode')
    ctx.body = res.records
    // console.log(res)
    session.close()
}

const create = new Router()

const createTest = async (ctx)=>{
    const {updatingParam, nodeId, nodeLabel} = ctx.request.body
    const session = driver.session()
    // console.log(updating)
    // console.log(nodeLabel)
    try {
        let res = await session.run(`match (original:${nodeLabel}) where id(original)=${nodeId} create (bu:${nodeLabel}:backup) set bu=original, bu.timestamp=timestamp()`)
        // let res = await session.run(`match (original:${nodeLabel}) where id(original)=${nodeId} create (bu:${nodeLabel}:backup) set bu=$props`, param)
        console.log(res)
        // const param = { props: updating.reduce( (obj, prop)=>({...obj, [prop.propName]:prop.value} ), {}) }
        res = await session.run(`match (original:${nodeLabel}) where id(original)=${nodeId} set original+=$props, original.updated_dt = date()`, updatingParam)
        // res = await session.run(`match (original:${nodeLabel}) where id(original)=${nodeId} return original {.*, updated_dt:date()}`, param)
        console.log(res)
        ctx.body = res
    } catch (error) {
        console.log(error)
        ctx.body = ''
    }
    session.close()
}

create.put('/create-test', KoaBody(), createTest)

export default create