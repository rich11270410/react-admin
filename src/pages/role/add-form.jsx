import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
} from 'antd'

const {Item} = Form

/*
用来添加角色的form组件
*/
class AddForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  /*在第一次render()之前执行
  为第一次render执行同步操作(准备数据)
  */
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '必须角色名称',
              }
            ],
          })(
          <Input type="text" placeholder="请输入角色名称"/>
          )
          }
        </Item>
      </Form>
    )
  }
}

export default AddForm = Form.create()(AddForm)