import Router from 'koa-router'

import driver from '../driver'

const specifyTypeIsPosChecker = (landuse) => {
    const positive = [
        '제1종전용주거지역',
        '제2종전용주거지역',
        '제1종일반주거지역',
        '제2종일반주거지역',
        '제3종일반주거지역',
        '보전녹지지역',
        '생산녹지지역',
        '자연녹지지역'
    ]
    const negative = [
        '준주거지역',
        '중심상업지역',
        '일반상업지역',
        '근린상업지역',
        '유통상업지역',
        '준공업지역'
    ]
    if (positive.indexOf(landuse) !== -1) {
        return true
    } else if (negative.indexOf(landuse) !== -1) {
        return false
    } else {
        return landuse
    }
}

const mapFunctions = {
    국토계획법: (specifyTypeIsPos) =>
        specifyTypeIsPos
            ? (f) => {
                  let gukgye
                  if (f.consts.length) {
                      if (f.consts[0].properties.law === '국토계획법') {
                          const gukgye_data = f.consts[0].properties
                          if (gukgye_data.effect === '가능') {
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
                  return { ...f, gukgye: gukgye }
              }
            : (f) => {
                  let gukgye
                  if (f.consts.length) {
                      if (f.consts[0].properties.law === '국토계획법') {
                          const gukgye_data = f.consts[0].properties
                          if (gukgye_data.effect === '불가') {
                              gukgye = false
                          } else {
                              gukgye = 'jorye'
                          }
                      } else {
                          gukgye = true
                      }
                  } else {
                      gukgye = true
                  }
                  return { ...f, gukgye: gukgye }
              },

    조례: (specifyTypeIsPos) =>
        specifyTypeIsPos
            ? (f) => {
                  let jorye
                  if (f.consts.length > 1) {
                      if (f.consts[1].properties.law === '도시계획조례(서울)') {
                          const jorye_data = f.consts[1].properties
                          if (jorye_data.effect === '가능') {
                              jorye = true
                          } else {
                              console.log('?')
                              jorye = jorye_data.effect
                          }
                      }
                  } else {
                      jorye = false
                  }
                  return { ...f, jorye: jorye }
              }
            : (f) => {
                  let jorye
                  if (f.consts.length > 1) {
                      if (f.consts[1].properties.law === '도시계획조례(서울)') {
                          const jorye_data = f.consts[1].properties
                          if (jorye_data.effect === '불가') {
                              jorye = false
                          } else {
                              console.log('?')
                              jorye = jorye_data.effect
                          }
                      }
                  } else {
                      jorye = true
                  }
                  return { ...f, jorye: jorye }
              },

    지구단위계획: {
        국제교류복합지구: (jdConstList) => (f, idx) => {
            const jd = jdConstList.records[idx]
            let jidan
            if (jd.get('consts').length) {
                jidan = jd.get('consts')[0].properties.effect
                console.log(jidan)
            } else {
                jidan = true
            }
            return { ...f, jidan: jidan }
        }
    },

    특별법: {
        교육환경법: (spcConstList) => (f, idx) => {
            const spcConst = spcConstList.records[idx]
            let spc
            if (spcConst.get('consts').length) {
                spc = false
            } else {
                spc = true
            }
            return { ...f, spc: spc }
        }
    }
}

const check = new Router()

const getAvailList = async (ctx) => {
    const { landuse, jdName, spcLawList } = ctx.query
    // console.log(landuse)
    // console.log(jdName)
    // console.log(spcLawList)
    // console.log(JSON.parse(spcLawList))
    const session = driver.session()
    const facilityList = await session.run(
        `match (f:facility) optional match (f)--(c:const) where c.landuse='${landuse}' with f._str as name, id(f) as id, c order by f.ssNum, c.chkPriority with name, id, c return name, id, collect(c) as consts`
    )
    let result = facilityList.records.map((f) => ({
        name: f.get('name'),
        id: f.get('id').toInt(),
        consts: f.get('consts')
    }))

    const specifyTypeIsPos = specifyTypeIsPosChecker(landuse)

    if (typeof specifyTypeIsPos === 'string') {
        ctx.body = result
    } else {
        result = result
            .map(mapFunctions.국토계획법(specifyTypeIsPos))
            .map(mapFunctions.조례(specifyTypeIsPos))

        if (jdName) {
            const jdConstList = await session.run(
                `match (f:facility) optional match (f)--(c:const) where c.jdName='${jdName}' with f, c order by f.ssNum return id(f), collect(c) as consts`
            )
            console.log(jdName)
            console.log(mapFunctions.지구단위계획[jdName])
            result = result.map(mapFunctions.지구단위계획[jdName](jdConstList))
        }

        let spcList = JSON.parse(spcLawList)
        if (spcList.length) {
            const spcName = spcList[0]
            const spcConstList = await session.run(
                `match (f:facility) optional match (f)--(c:const) where c.law='${spcName}' with f, c order by f.ssNum return id(f), collect(c) as consts`
            )

            result = result.map(mapFunctions.특별법[spcName](spcConstList))
        }

        ctx.body = result
    }

    session.close()
}

check.get('/get-avail-list', getAvailList)

export default check
