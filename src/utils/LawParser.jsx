import React, { useState, useEffect } from "react"
import Axios from 'axios'

const mokChar = ['호','가','나','다','라','마','바','사','아','자','차','카','타','파','하','거','너','더','러','머','버','서','어','저','처','커','터','퍼','허']

export default ()=>{
    const [star, setStar] = useState('')

    useEffect(()=>{

        // Axios.get(`/api/facilities?ho=1&mok=${encodeURI('가')}`).then(console.log)
        // Axios.get('/api').then(console.log)
        // Axios.get('/api/detail?lawid=212891') // 법령 마스터번호 국토계획법 시행령
        // Axios.get('/api/detail?lawid=009419') // 법령ID 국토계획법 시행령
        // Axios.get('/api/detail?lawid=215005') // 법령 마스터번호 건축법 시행령 - 현행()

        // // 건축법 시행령 용도분류 파싱
        // Axios.get('/api/detail?lawid=002118') // 법령ID 건축법 시행령 - 현행(id 불변)
        // .then(res=>{
        //     console.log(res.data.obj.법령.별표[0].별표단위[0].별표내용[0])
        //     const tmp = []
        //     let r=0
        //     res.data.obj.법령.별표[0].별표단위[0].별표내용[0].split('용도별 건축물의 종류(제3조의5 관련)')[1].split('비고 ')[0].split(/ [0-9]+\. /).forEach((hoContent, hoNum) => {
        //         const ho = `${hoNum}호 `
        //         const contList = hoContent.split(/ [가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허]\. /)
        //         tmp.push(<p key={ho}>{ho+contList[0]}</p>)
        //         // if (contList.length>1) {
        //             contList.forEach( async (content, mokIdx)=>{
        //                 if (mokIdx===0) {
        //                     Axios.put(`/api/make-ho-raw-law`, {ho: hoNum, lawText: content})
        //                 }
        //                 else {
        //                     const mok = `${mokChar[mokIdx]}목 `
        //                     tmp.push(<p key={ho+mok}>{ho+mok+content}</p>)

        //                     r+=1
        //                     // const facilities = await Axios.get(`/api/facilities?ho=${hoNum}&mok=${encodeURI(mokChar[mokIdx])}`)
        //                     // Axios.get(`/api/make-mok-raw-law?ho=${hoNum}&mok=${encodeURI(mokChar[mokIdx])}&lawText=${mokContent}`)
        //                     // if (facilities.data.length===0) {
        //                     //     console.log(hoNum, mokChar[mokIdx])
        //                     //     console.log(facilities)
        //                     // }

        //                     Axios.put(`/api/make-mok-raw-law`, {ho: hoNum, mok: mokChar[mokIdx], lawText: content})
        //                 }
        //             })
        //         // }
        //     })
        //     console.log(r)
        //     setStar(tmp)
        // })

        // 국토계획법 시행령 별표 파싱 - 용도지역별 허용/불허 건축물
        Axios.get('/api/detail?lawid=009419') // 법령ID 국토계획법 시행령
        .then(res=>{
            // console.log(res)
            // console.log(res.data.obj.법령.조문[0].조문단위.filter(jo=>jo.조문내용[0].indexOf('용도지역안에서의 건축제한')!==-1))
            
            // 71조, 용도지역안에서의 건축제한 ,, 혹시라도 조문 번호가 바뀌거나 조문제목이 미세하게 달라질 수 있을 것 같아서 조문 내용에서 키워드 검색하는 방식으로 탐색,,
            const jo = res.data.obj.법령.조문[0].조문단위
                .filter(jo=>(jo.조문내용[0].indexOf('용도지역안에서의 건축제한')!==-1))[0]
            
            // 1항 - 아마도 바뀔 가능성은 크게 없어보임
            const hang = jo.항[0]

            // 각호: 용도지역별 별표 번호 확인
            const hoList = hang.호
            
            const tmp = []
            hoList.forEach(ho=>{
                // console.log(/[0-9가-힣]+안에서/.exec(ho.호내용[0])[0].replace('안에서',''))
                const landuse = /[0-9가-힣]+안에서/.exec(ho.호내용[0])[0].replace('안에서','')
                console.log(landuse)
                tmp.push(<p>{landuse}</p>)

                // console.log(/별표 [0-9]+/.exec(ho.호내용[0])[0])
                const starNum = /별표 [0-9]+/.exec(ho.호내용[0])[0].split(' ')[1]
                console.log(starNum)
                tmp.push(<p>{`별표 ${starNum}`}</p>)

                const starContent = res.data.obj.법령.별표[0].별표단위
                    .filter(star=>Number(star.별표번호[0])===Number(starNum))[0]
                    .별표내용[0]
                console.log(starContent)
                starContent.split(/ [0-9]+\. /).forEach((el, hoIdx)=>{
                    // tmp.push(<p>{el}</p>)
                    el.split(/ [가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허]\. /).forEach((mok, mokIdx)=>{
                        tmp.push(<p>{hoIdx+' '+mokIdx+' '+mok}</p>)
                    })
                })
                tmp.push(<p>&nbsp;</p>)


            })
            setStar(tmp)
        })

    }, [])

    return (
    <div>
        {star}
    </div>
    )

}