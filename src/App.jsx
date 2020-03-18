import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import './App.css'

const mokChar = ['호','가','나','다','라','마','바','사','아','자','차','카','타','파','하','거','너','더','러','머','버','서','어','저','처','커','터','퍼','허']

export default ()=>{
    const [star, setStar] = useState('')

    useEffect(()=>{

        Axios.get(`/api/facilities?ho=1&mok=${encodeURI('가')}`).then(console.log)
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
    }, [])

    return (
    <div>
        {star}
    </div>
    )
}
// "  1. 제1종전용주거지역안에서 건축할 수 있는 건축물 : 별표 2에 규정된 건축물"