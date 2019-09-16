import React, { Component } from 'react'

import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import memoryUtils from '../../utils/memoryUtils'

const {Option} = Select
/*
商品管理的默认子路由组件
*/
export default class ProductHome extends Component {
  //初始化
  state = {
    products: [], // 当前页的商品数组
    total: 0, //总商品数量
    searchType: 'productName',
    searchName: ''
  }

  /*
  根据指定页码异步请求获取对应页的数据显示
  1.发送请求  如果请求成功 更新状态
  */
  getProducts = async (pageNum) => {
    //保存当前请求的页码
    this.current = pageNum
    let result
    //读取状态
    const {searchType, searchName} = this.state
    if (this.search && searchName) { //// 搜索分页请求
      result = await reqSearchProducts({ pageNum, pageSize: 2, searchType, searchName})
    } else { //发一般分页的请求
      //发送请求
      result = await reqProducts(pageNum, 2) //pagenum 第几页，第二个参数是pagesize 每页记录数
    } 
    //如果发送请求成功
    if (result.status === 0)  {
      //获取   total总数
      // console.log(result.data)
      const {list, total} = result.data
      //更新
      // console.log(list,list.length)
      this.setState({ 
        products: list, 
        total
      })
    }
  }

  reqUpdateStatus = async (productId, status) => {
    //reqUpdateStatus () 调用接口请求函数
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品状态成功')
      this.getProducts(this.current) // 重新获取当前页显示
    }
  }
  /*在第一次render()之前执行
  为第一次render执行同步操作(准备数据)
  */
  componentWillMount () {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price
      },
      {
        title: '状态',
        // dataIndex: 'status',
        width: 100,
        render: ({ _id, status }) => { // 1: 在售, 2: 已下架
          let btnText = '下架'
          let text = '在售'
          if (status === 2) {
            btnText = '上架'
            text = '已下架'
          }

          return (
            <React.Fragment>
              <Button
                type="primary"
                onClick={() => this.reqUpdateStatus(_id, status === 1 ? 2 : 1)}>
                {btnText}
              </Button>
              <span>{text}</span>
            </React.Fragment>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => { 
          return (
            <>
              <LinkButton
                onClick = {
                  () => {
                    //将product保存到共享内容
                    memoryUtils.product = product
                    //跳转到detail组件显示produc
                    this.props.history.push(`/product/detail/${product._id}`)      
                  }
                }
              >
                详情
              </LinkButton>
              {/** 必须是BrowserRouter  才能用push的第二个参数*/}
              <LinkButton onClick={() => {
                this.props.history.push('/product/addupdate', product)
              }}
              >
                修改
              </LinkButton>
            </>
          )
        }
      }
    ]
  }

  ////异步操作
   componentDidMount () {
     this.getProducts(1)
   }

  render() {
    //读取state
    const { products, total, searchType, searchName} = this.state
    const title = (
      <>
        <Select 
          value={searchType}
          style={{width: 150}}
          
          onChange={value => this.setState({searchType: value})}
        >
          <Option key="1" value="productName">按名称搜索</Option>
          <Option key="2" value="productDesc">按描述搜索</Option>
        </Select>
        <Input 
          placeholder="关键字"
          value={searchName}
          style={{width: 200, margin: '0 15px'}}

          // {onchange输入框内容变化时的回调}
          onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type="primary" onClick={() => {
          //保存一个搜索标记 一旦点击搜索就都是搜索，除非刷新
          this.search = true
          this.getProducts(1)
        }}>搜索</Button>
      </>
    )
    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered
          rowKey="_id"
          dataSource={products} //数据源
          columns={this.columns}
          pagination={{
            current: this.current, // 当前选中哪个页码
            pageSize: 2,
            total,
            onChange: this.getProducts //cnChange 页码改变的回调
          }}
        />
      </Card> 
    )
  }
}
