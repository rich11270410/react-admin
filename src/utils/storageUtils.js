//通过localStorage来管理（保存/读取/删除）数据
import store from 'store' //使用store库简化了使用localStorage原生方法的操作

const USER_KEY = 'user_key'
export default {
  //登录成功，保存user
  saveUser (user) {
    // localStorage.setItem('user_key', JSON.stringify(user))
    store.set(USER_KEY, user) //存储对象 - 自动调用 JSON.stringify
  },
  
  //读user 
  getUser() {
    // return JSON.parse(localStorage.getItem('user_key') || '{}')
    return store.get(USER_KEY) || {} //获取存储的对象 - 自动执行 JSON.parse
  },

  //登出,删除保存的user
  removeUser() {
    // localStorage.removeItem('user_key')
    store.remove(USER_KEY)
  }
}