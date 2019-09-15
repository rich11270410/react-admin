import React, { useState, useEffect, useRef} from 'react'
import {Modal, message} from 'antd'

import CategoryForm  from './category-form'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'
import {
  Card,
  Button,
  Icon,
  Table
} from 'antd'
/**
 * 分类管理
 */

 export default function Category(props) {
   //useState   返回值为：当前 state 以及更新 state 的函数
   const [categorys, setCategorys] = useState([])
   const [loading, setLoading] = useState(false)
   const [showStatus, setShowStatus] = useState(0)

   const formRef = useRef()
   const categoryRef = useRef({})
   const columnsRef = useRef([
       {
         title: '分类名称',
         dataIndex: 'name'
       },
       {
         width: 250,
         title: '操作',
         render: (category) => <LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
       }
   ])

    useEffect(() => {
      getCategorys()
    }, []) 
   
   /*
  获取获取所有分类列表显示
  */
   async function getCategorys() {
     //显示loading
     setLoading(true)
     const result = await reqCategorys()
     //隐藏loading
     setLoading(false)
     if (result.status === 0) {
       const categorys = result.data
       setCategorys(categorys)
     }
   }
   //添加分类
   function addCategory() {
     //对form进行验证
     formRef.current.validateFields(async (error, values) => {
       if (!error) {
         //重制输入框中的数据（initialValue）
         formRef.current.resetFields()
         //验证通过后发请求添加分类
         const result = await reqAddCategory(values.categoryName)
         if (result.status === 0) {
           setShowStatus(0)
           message.success('添加分类成功')

           //获取最新分类列表显示
          getCategorys()
         } else {
           message.error(result.msg || '添加分类失败')
         }
       }
     })
   }

   //修改分类
   function updateCategory() {
     //对form进行验证
     formRef.current.validateFields(async (error, values) => {
       if (!error) {
         //重制输入框中的数据（initialValue）
         formRef.current.resetFields()
         //验证通过后发请求添加分类
         values.categoryId = categoryRef.current._id
         const result = await reqUpdateCategory(values)
         if (result.status === 0) {
           setShowStatus(0)
           message.success('修改分类成功')

           //获取最新分类列表显示
           getCategorys()
         } else {
           message.error(result.msg || '修改分类失败')
         }
       }
     })
   }
   
   //取消
   function handleCancel () {
     //重制输入框中的数据（initialValue）
     formRef.current.resetFields()
     setShowStatus(0)
   }

    /* 
    显示添加界面
    */
    function showAdd() {
      setShowStatus(1)
    }
    /* 
    显示修改界面
    */
    function showUpdate(category) {
      // 保存当前分类
      categoryRef.current = category
      setShowStatus(2)
    }

   //取出保存的用于更新的分类对象  
   //在初始状态的时候，category没有值
    const category = categoryRef.current

    const extra = (
      <Button type="primary" onClick={showAdd}>
        <Icon type="plus"></Icon>
        添加
        </Button>
    )
    return (
      <Card extra={extra}>
        <Table
          loading={loading}
          bordered={true}
          rowKey="_id" //数据对象category的_id的属性值作为每行的key
          //pageSize 默认一页显示多少  showQuickJumper：goto跳转多少页
          pagination={{ pageSize: 2, showQuickJumper: true }}
          dataSource={categorys} //数据源
          columns={columnsRef.current}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={addCategory}
          onCancel={handleCancel}
        >
          {/*this.form = form}  保存form*/}
          <CategoryForm setForm={(form) => { formRef.current = form }} />
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={updateCategory}
          onCancel={handleCancel}
        >
          <CategoryForm
            categoryName={category.name}
            setForm={(form) => formRef.current = form }
          />
        </Modal>
      </Card>
    )
 }