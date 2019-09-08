import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import AddForm from './add-form'
import AuthForm  from './auth-form'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import LinkButton from '../../components/link-button'
import {formateDate} from '../../utils/dateUtils'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'

/**
 * 角色管理
 */
export default class Role extends Component {
  state = {
    roles: [], //所有角色的列表
    isShowAdd: false, //是否显示添加界面
    isShowAuth: false //是否显示设置权限界面
  }

  authRef = React.createRef() //创建ref
  /* 
  初始化table列数组
  */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
      
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={() => this.ShowAuth(role)}>设置权限</LinkButton>
      },

    ]
  }

  //显示权限设置界面
  ShowAuth = (role) => {
    this.role = role
    this.setState({
      isShowAuth: true
    })

  }

  //异步获取角色列表显示
  getRoles = async () => {
    //发送请求
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      //更新
      this.setState({
        roles
      })
    }
  }

  //添加角色
  addRole = () => {
    //进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        //重制输入
        this.form.resetFields()
        //隐藏输入框
        this.setState({
          isShowAdd:false
        }) 
          //发送请求   
        const result = await reqAddRole(values.roleName)  
        console.log(values.roleName);
        if (result.status === 0) {
          message.success('添加角色成功')
           // this.getRoles() 获取所有用户列表(优势：多个人添加总是获取最新的数据)
          const role = result.data //data角色对象 (优势：此时不用发请求)
          const roles = this.state.roles
          //更新
          this.setState({
            roles: [...roles, role]
          })
        }  
        }
      })
    }

    //给角色授权
  updateRole = async () => {
    //隐藏确认框
    this.setState({
      isShowAuth: false
    })

    const role = this.role
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username 
    //发送请求
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success(`给${role.name}授权成功`)
      //获取角色列表显示
      this.getRoles()
    }
  }
    
  /*在第一次render()之前执行
  为第一次render执行同步操作(准备数据)
  */
  componentWillMount () {
    this.initColumn()
  }

  //异步请求
  componentDidMount () {
    this.getRoles()
  }
 
  render() {
    const role = this.role || {} // 如果没有传空对象，避免报错
    //获取
    const { roles, isShowAdd, isShowAuth } = this.state
    const title = (
      <Button type='primary' onClick={() => {this.setState({isShowAdd: true})}}>
        创建角色
      </Button>
    )
    return (
      <Card title={title}>
        <Table 
        bordered
        rowKey='_id'
        dataSource={roles} //数据源
        columns={this.columns}
        pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd:false})
            this.form.resetFields() //表单输入数据重置
          }}
        >
          <AddForm 
            setForm = {(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm
           ref={this.authRef} role={role}
          />
        </Modal>
      </Card>
    )
  }
}
