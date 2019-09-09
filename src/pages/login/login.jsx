import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {Button, Form, Icon, Input, message} from 'antd'
import {connect} from 'react-redux'

import {login} from '../../redux/actions'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import { reqLogin } from '../../api'
import logo from '../../assets/images/logo.png'
import './login.less'


const {Item} = Form
//一级路由组件：登录
class Login extends Component {
  
  //提交函数
  handleSubmit = event => {
    //阻止事件默认行为（不提交表单)
    event.preventDefault()
   
    //得到输入数据
    const form = this.props.form
    //getFieldValue	获取一个输入控件的值
    // const username = form.getFieldValue('username')
    // const password = form.getFieldValue('password')
    // const values = form.getFieldsValue()
    // console.log(username, password, values)

    //自定义校验 校验成功了才能登录
    form.validateFields(async (error, {username, password}) => {
    /*
      err 表单校验失败的错误
      values 表单输入的值
    */
      if (!error) { //验证通过
        this.props.login({ username, password })
        
      } else {
        console.log('前台表单验证失败')
      }
    })
  }

  // //验证密码的验证器函数
  validatePwd = (rule,value,callback) => {
    value = value.trim()
    if(!value) {
      callback('必须输入密码!')
    } else if (value.length < 4) {
      callback('密码不能小于4位')
    } else if (value.length > 12) {
      callback('密码不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码只能包含英文、数字或下划线!')
    } else {
      callback() //验证通过
    }
  }

  render() {
    //读取之后要将JSON字符串转换成为JSON对象，使用JSON.parse()方法
    const user = this.props.user

    //如果登录
    if (user._id) {
      //自动跳转到admin
      return <Redirect to="/"></Redirect>
    }

    //getFieldDecorator（高阶组件） 此方法获取表单数据，初始化表单数据，校验表单数据
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login"> 
        <div className="login-header">
          <img src={logo} alt="logo"/>
          <h1>后台管理系统</h1>
        </div>
        <div className="login-content">
          {user.msg ? <div style={{color: 'gray'}}>{user.msg}</div> : null}
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
              /*
             1). 必须输入
             2). 必须大于等于4位
             3). 必须小于等于12位
             4). 必须是英文、数字或下划线组成
             */
                getFieldDecorator('username', {
                  initialValue: '', //指定输入框的初始值

                  //声明式验证：使用内置的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '必须输入用户名！' },
                    { min: 4, message: '用户名不能小于4位' },
                    { max: 12, messsage: '用户名不能大于12位' },
                    //pattern 属性规定用于验证输入字段的模式
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含英文、数字或下划线!' }
                  ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  initialValue: '', // 指定输入框的初始值
                  
                  //声明式验证：使用内置的验证规则进行验证
                  rules: [
                    { validator: this.validatePwd }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
               登录
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedLogin = Form.create()(Login)
export default connect(
  state => ({
    user: state.user
  }),
  {login}
)(WrappedLogin)

/*
高阶组件用法：接收一个Login组件，返回一个新组件，就多了些form属性

*/ 