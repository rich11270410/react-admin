import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'

/*
封装axios,函数的返回值promise
  1. 统一处理请求异常
  2. 异步请求成功的数据不是response, 而是response.data
*/

//使用请求拦截器
axios.interceptors.request.use((config) => {
  //将post请求参数转换为urlencoded(默认json格式)  ===> 使用请求拦截器
  let data = config.data
  if (data && data instanceof Object) {
    //qs.stringify 将对象序列化成URL的形式，以&进行拼接
    config.data = qs.stringify(data)
  }
  return config
})

//使用响应拦截器
//响应拦截器的作用是在接收到响应后进行一些操作，
//例如在服务器返回登录状态失效，需要重新登录的时候，跳转到登录页
axios.interceptors.response.use(
  //请求成功的结果不是response, 而是response.data
  response => {
    //请求成功的结果不是response, 而是response.data ===> 使用响应拦截器(成功回调)
    return response.data
  },
  error => {
    message.error('请求出错' + error.message)
    // 统一处理请求错误  ===> 使用响应拦截器(失败回调)
     return new Promise(() => {}) //中断promise链
  }
)

//暴露axios
export default axios
