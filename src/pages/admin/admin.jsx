import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout
//一级路由：管理
class Admin extends Component {
  render() {

    //读取之后要将JSON字符串转换成为JSON对象，使用JSON.parse()方法
    const user = this.props.user

    //如果没有登录, user没有_id
    if (!user._id) {
      //自动跳转到/login
      return <Redirect to="/login"></Redirect>
    }

    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header></Header>
          <Content style={{ backgroundColor: 'white', margin: 20 }}>
            <Switch>
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/product" component={Product}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/charts/bar" component={Bar}></Route>
              <Route path="/charts/line" component={Line}></Route>
              <Route path="/charts/pie" component={Pie}></Route>
              <Redirect to="/home"></Redirect>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  {}
)(Admin)
