import React from 'react'

import './index.less'
/*
包装button实现的看似链接的通用组件
*/
export default function LinkButton(props) {
  return <button className="link-button" {...props}></button>
}
