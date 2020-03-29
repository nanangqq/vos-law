import Router from 'koa-router'
import KoaBody from "koa-body"
import Axios from 'axios'
import {parseStringPromise} from 'xml2js'


const lawParser = new Router()

const test = async (ctx)=>{
    // 현행법령 검색 - 이름으로: 검색어 일치하는 법 모두 나옴
    // const res = await Axios.get('http://www.law.go.kr/DRF/lawSearch.do?target=law&OC=kh.yoo&type=XML&query='+encodeURI('국토의계획및이용에관한법률'))
    // const res = await Axios.get('http://www.law.go.kr/DRF/lawSearch.do?target=law&OC=kh.yoo&type=XML&query='+encodeURI('건축법'))

    // 법령 연혁 검색 html만 가능,,
    // const res = await Axios.get('http://www.law.go.kr/DRF/lawSearch.do?OC=kh.yoo&target=lsHistory&type=XML&query='+encodeURI('건축법'))

    // 법령 시행일 목록 검색: 법령 id로 검색 가능 (id는 법 종류마다 유일. 일련번호는 개정안 공표될 때마다 부여되는 번호) => 시행예정 법안 일련번호와 시행일 정보 획득 가능
    // const res = await Axios.get('https://www.law.go.kr/DRF/lawSearch.do?OC=kh.yoo&target=eflaw&LID=002118')

    // 법령 시행날짜 본문 검색: 법령일련번호와 시행일을 모두 입력해야 함
    // const res = await Axios.get('http://www.law.go.kr/DRF/lawService.do?OC=kh.yoo&target=eflaw&MST=210075&efYd=20210807&type=XML')

    // 현행법령 검색 - 법률 일련번호로 : 날짜 없이 현행 아니라도 검색 가능
    const res = await Axios.get('http://www.law.go.kr/DRF/lawService.do?OC=kh.yoo&target=law&MST=8244&type=XML')

    console.log(__dirname)

    const obj = await parseStringPromise(res.data)
    ctx.body = obj
}

const getLawDetail = async (ctx, next)=>{
    // console.log(ctx.query)
    // const pwd = await cp.exec('pwd')
    console.log(__dirname)
    const lawId = ctx.query.lawid
    const file = __dirname + `/data/lawDetail/${lawId}.json`
    const addr = `http://www.law.go.kr/DRF/lawService.do?OC=kh.yoo&target=law&ID=${lawId}&type=XML&mobileYn=&efYd=20200101`
    let obj
    try {
        obj = await jsonfile.readFile(file)
        ctx.body = {obj}
    } catch (error) {
        // console.log(error)
        const res = await Axios.get(addr)
        obj = await parseStringPromise(res.data)
        ctx.body = {obj, file}
        next()
    }
}

const saveLawDetail = async (ctx)=>{
    // console.log(ctx.body)
    jsonfile.writeFile(ctx.body.file, ctx.body.obj)
}

const createMokRawLaw = async (ctx)=>{
    const {ho, mok, lawText} = ctx.request.body
    const session = driver.session()
    if (mok) {
        session.run(`create (n:rawLaw) set n.ho=${ho}, n.mok='${mok}', n.lawText='${lawText}' `).then(()=>{
            session.run(`match (f:facility {ho:${ho}, mok:'${mok}'}), (n:rawLaw {ho:${ho}, mok:'${mok}'}) merge (f)-[r:represent]->(n)`)
            .then(console.log).catch(err=>console.log(err)).then(()=>{session.close()})
        })
    } else {
        session.close()
    }
    ctx.body=''
}

const createHoRawLaw = async (ctx)=>{
    const {ho, lawText} = ctx.request.body
    const session = driver.session()
    session.run(`create (n:rawLaw) set n.ho=${ho}, n.lawText='${lawText}'`).then(()=>{
        session.run(`match (f:facility {ho:${ho}, mok:'허'}), (n:rawLaw {ho:${ho}}) where n.mok is null merge (f)-[r:represent]->(n)`)
        .then(console.log).catch(err=>console.log(err)).then(()=>{session.close()})
    })
    ctx.body=''
}

lawParser.get('/test', test)
lawParser.get('/detail', getLawDetail, saveLawDetail)
lawParser.put('/api/make-mok-raw-law', KoaBody(), createMokRawLaw)
lawParser.put('/api/make-ho-raw-law', KoaBody(), createHoRawLaw)

export default lawParser