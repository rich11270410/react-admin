//redux最核心的管理对象: store

//createStore:创建包含指定reducer的store对象 
//applyMiddleware: 应用上基于redux的中间件(插件库)
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' //redux异步中间件
import {composeWithDevTools} from 'redux-devtools-extension' //开发调试工具

import reducer from './reducer' //redux的reducer函数必须是一个纯函数

//向外暴露stroe对象   创建store对象内部会第一次调用reducer()得到初始状态值
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))