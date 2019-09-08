import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menList from '../../config/menuConfig'

const {Item} = Form
const {TreeNode} = Tree

/*
添加分类的form组件
 */
export default class AuthForm extends PureComponent {

  static propTypes = {
    role: PropTypes.object
  }

  //初始显示
  constructor(props) {
    super(props)

    let checkedKeys = []
    const role = this.props.role
    if (role) {
      checkedKeys = role.menus
    }

    this.state = {
      checkedKeys
    }
  }
  
  getMenus = () => this.state.checkedKeys

  /*
  根据菜单数据数组生成<TreeNode>的数组
  */
  getTreeNodes = (menuList) => {
    return menuList.map( item => {
      return (
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
    }
    )
  }

  handleCheck = (checkedKeys) => { //checkedKeys 所有选中项key的数组
    //更新数据
    this.setState({
      checkedKeys
    })
  }

  //将要接收到新的属性的回调  设置角色权限每次都是最新的
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render() {
    const {checkedKeys} = this.state
    const {role} = this.props

    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    return (
      <>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable //设置独立节点展开
          defaultExpandAll //默认展开所有树节点

          //受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点key
          //则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。
          checkedKeys={checkedKeys}
          onCheck={this.handleCheck} //点击复选框触发
      >
        <TreeNode title='平台权限管理' key="all">
          {
              this.getTreeNodes(menList)
          }
        </TreeNode>
      </Tree>
      </>
    )
  }
}
