import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import UserForm from './user-form'
import {PAGE_SIZE} from '../../utils/constants'
import {formateDate} from '../../utils/dateUtils'
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from '../../api'
/**
 * 用户管理
 */
export default class User extends Component {

  state = {
    users: [], //所有用户的列表
    roles: [], //所有角色的列表
    isShow: false //是否显示对话框
  }
  
  //初始化Table的字段列表
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: role_id => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => ( 
          <span>
            <LinkButton onClick={() => {this.showUpdate(user)}}>修改</LinkButton>
            <LinkButton onClick={() => {this.clickDelete(user)}}>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  //显示添加用户的界面
  showAddUser = () => {
    //去除前面保存的user
    this.user = null
    this.setState({
      isShow: true
    })
  }

  //添加/更新用户
  addOrUpdateUser = async () => {
    //获取表单数据
    //getFieldsValue 获取一组输入控件的值，如不传入参数，则获取全部组件的值
    const user = this.form.getFieldsValue()
    this.form.resetFields() // 重置

    //如果是更新，需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id  
    }
    this.setState({
      isShow: false
    })
    
    //提交请求
    const result = await reqAddOrUpdateUser(user)
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      //更新列表显示
      this.getUsers()
    }
  }

  //显示修改用户的界面
  showUpdate = (user) => {
    //保存user
    this.user = user
    this.setState({
      isShow: true
    })
  }

  //异步获取所有用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data

      //生成包含角色名的对象（属性名是角色的id值）
      this.roleNames = roles.reduce((pre, role) => {
        pre[role._id] = role.name
        return pre
      },{})
      //更新
      this.setState({
        users,
        roles
      })
    }
  }

  /*
  响应点击删除用户
  */
  clickDelete = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          //更新显示
          this.getUsers()
        }
      }

    })
  }

  componentWillMount () {
    this.initColumns()
  }

    //异步请求
  componentDidMount () {
    //获取数据更新显示
    this.getUsers()
  }

  render() {
    const {users, isShow, roles} = this.state
    const user = this.user || {}
    const title = <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
    return (
      <div>
        <Card title={title}>
          <Table
            columns={this.columns} 
            rowKey="_id"
            dataSource={users} // 数据数组
            bordered
            pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
          />
          <Modal
            title={user._id ? '修改用户' : '添加用户'}
            visible={isShow}
            onOk={this.addOrUpdateUser}
            onCancel={() => {
              this.form.resetFields()
              this.setState({ isShow: false })
            }    
            }
          >
            <UserForm 
              setForm = {(form) => this.form = form}
              user={user}
              roles={roles}
            />
          </Modal>
        </Card>
      </div>
    )
  }
}
