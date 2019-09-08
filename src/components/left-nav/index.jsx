import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'


const { SubMenu, Item } = Menu

//Admin的左侧导航组件
class LeftNav extends Component {
  /*
  判断当前用户是否有此item对应的权限
  */
  hasAuth = (item) => {
    const user = memoryUtils.user
    const menus = user.role.menus
      /*
    1. 如果当前用户是admin
    2. 如果此item是一个公开的
    3. item的key在menus中
    4. 如果和一个cItem的key在menus中
    */
    if (user.username === 'admin' || item.isPublic || menus.indexOf(item.key) != -1) {
      return true
    } else if (item.children) {
      return item.children.some(cItem => menus.indexOf(cItem.key) != -1)
    }
    return false
  }
  /*
  根据数据的数组生成<Item>和<SubMenu>组成的数组
  reduce() + 递归
  */
  getMenuNodes2 = (menuList) => {
    //请求的路由路径
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {

      //如果当前用户有此item对应的权限，才添加
      if (this.hasAuth(item)) {

        // 向pre中添加<Item>
        if (!item.children) {
          pre.push(
            <Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Item>
          )
        } else { // 向pre中添加<SubMenu>

          // 请求的路由路径对应children中某个
          if (item.children.some(item => path.indexOf(item.key) === 0)) {
            // 将item的key保存为openKey
            this.openKey = item.key
          }

          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes2(item.children)}
            </SubMenu>
          )
        }
      }
      return pre
    },[])
  }
  /*
  根据数据的数组生成<Item>和<SubMenu>组成的数组
  map() + 递归
  */
  getMenuNodes = (menuList) => {
    //请求的路由路径
    const path = this.props.location.pathname
    return menuList.map(item => {
      //返回<Item></Item>
      if (!item.children) {
        return (
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}></Icon>
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else { //返回<SubMenu></SubMenu>
        // 请求的路由路径对应children中某个
        if (item.children.some(item => item.key === path)) {
          // 将item的key保存为openKey
          this.openKey = item.key
        }
        return (
          <SubMenu
          key={item.key}
          title={
            <span>
              <Icon type={item.icon}></Icon>
              <span>{item.title}</span>
            </span>
          }
          >
           {this.getMenuNodes(item.children)} 
          </SubMenu>
        )
      }
    })
  }

  //在第一次render()之前执行
  /*为第一次render执行同步操作(准备数据)
  */
  componentWillMount () {
    this.menuNodes = this.getMenuNodes2(menuList)
  }
  render() {
    const menuNodes = this.menuNodes
    //读取当前请求的路由路径
    const selectedKey = this.props.location.pathname
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to="/home" className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
         </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}  /* 多次指定值, 每次指定都生效 */
          defaultOpenKeys={[openKey]} //初始展开的 SubMenu 菜单项 key 数组
        >
          {menuNodes}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav) //新的组件会向非路由组件传递history/location/match属性
