import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types' //propTypes进行类型检测

const { Item }= Form

/*
用于分类的添加和修改form组件
*/
class CategoryForm extends Component {
  //propTypes进行类型检测
  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired
  }
  /*
  在第一次render()之前执行
  为第一次render执行同步操作(准备数据)
  */
  componentWillMount () {
    //调用父组件传入函数，将form对象作为数据传递给父组件Category
    this.props.setForm(this.props.form)
  }

  render() {
    const { categoryName } = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
                      /*
              如果不手动输入修改, 每次指定新的都有效果
              如果手动输入修改, 再指定新的无效(总是显示手动输入)
              */
              initialValue: categoryName,
              rules: [
                {
                  required: true, whitespace: true,
                  message: '必须输入分类名称',
                },
              ],
          })(
            <Input placeholder="请输入商品名称" />)
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(CategoryForm)
