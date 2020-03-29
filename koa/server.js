import Koa from "koa"
import Router from "koa-router"
import { exec } from "child_process"

import check from './check'
import lawParser from './law-parser'
import search from './search'


const startServer = async ()=>{
    const app = new Koa()
    const router = new Router()

    const PORT = process.env.PORT || 3001
    const HOSTNAME = exec('hostname -i', (error, stdout, stderr)=>{
        if (!error & !stderr) {
            console.log('host: %s', stdout)
        } else {
            console.log(error, stderr)
        }
    })

    router.use('/check', check.routes())
    router.use('/search', search.routes())
    router.use('/law-parser', lawParser.routes())

    app.use(router.routes())

    app.listen(PORT, HOSTNAME, ()=>{
        console.log('==> 🌎  Listening on port %s.', PORT)
    });
}

startServer()