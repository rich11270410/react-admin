//包含n个reducer函数的模块
 //  reducer函数： 根据当前state和指定action返回一个新的state

import {combineReducers} from 'redux'   //合并多个reducer函数,返回一个总的reducer

import storageUtils from '../utils/storageUtils'

import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_MSG,
  LOGOUT
} from './action-types'

 // 管理头部标题状态数据的reducer函数
const initHeaderTitle = '首页'
function headerTitle(state=initHeaderTitle, action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return action.data
    default:
      return state
  }
}

//管理登录用户信息状态数据的reducer函数
const initUser = storageUtils.getUser()
function user(state=initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_MSG:
      return {...state, msg: action.msg}
    case LOGOUT:
      return {}    
    default:
      return state
  }
}
export default combineReducers({ 
  headerTitle,
  user
})