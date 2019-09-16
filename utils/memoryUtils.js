import storageUtils from './storageUtils'
/* 
在内存存储数据的工具对象
*/
////读取之后要将JSON字符串转换成为JSON对象，使用JSON.parse()方法

export default {
  //存储当前登录用户
  user: storageUtils.getUser(), //多次读取，会读多次local
  product: {} //需要显示的商品
}