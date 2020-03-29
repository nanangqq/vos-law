import Router from 'koa-router'
import KoaBody from "koa-body"

import {getFacilityById, getFacilityList, getConstList, getLinkedNodes, getNodeById, getNodeList, searchFacilityByName} from './controllers'

const search = new Router()

search.get('/facilities', getFacilityList)
search.get('/consts', getConstList)
search.get('/get-nodes-by-label', getNodeList)
search.get('/facility-by-id', getFacilityById)
search.get('/node-by-id', getNodeById)
search.get('/linked-nodes', getLinkedNodes)
search.get('/search-facility-by-name', searchFacilityByName)

export default search