import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_PATH } from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends React.Component {
  //限制类型
  static propTypes = {
    imgs: PropTypes.array //数组
  }

  constructor(props) {
    super(props)

    let fileList = []
    //读取
    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      //根据imgs生成包含n个file对象的数组
      fileList = imgs.map((img, index) => ({
        uid: index,
        name: img,
        status: 'done',
        url: BASE_IMG_PATH + img
      }))
    }
    this.state = {
      previewVisible: false, //是否显示大图预览Modal
      previewImage: '', //大图的url/base64字符串
      fileList  //所有已上传文件对象的数组
    }
  }

  //返回所有已上传图片文件名的数组
  getImgs = () => this.state.fileList.map(file => file.name)

  /*
  隐藏大图预览
  */
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {//file里面没有url，preview(预览)没有产生
       // 加载本地图片, 进行BASE64编码, 将编码文本保存到file的preview属性
      file.preview = await getBase64(file.originFileObj);
    } 
    //更新
    this.setState({
      previewImage: file.url || file.preview, //图片文件地址（优先考虑）|| base64编码的值
      previewVisible: true, //显示大图
    })
  }

  /*
  文件状态改变的回调
  状态有：uploading done error removed
  */
  handleChange = async ({ file, fileList }) => {
    if (file.status==='done') { //上传已完成
      // file与fileList中最后一个file代表同一个图片信息的对象(不是同一个)
      //改变fileList里面到最后一个的name和url
      file = fileList[fileList.length-1]
      //取出响应数据中的name  url
      const {name, url} = file.response.data
      //保存到file对象上
      file.name = name
      file.url = url
    } else if (file.status === 'removed') { //删除图片
      //发请求删除后台保存的图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      }
    }
    //更新fileList状态数据
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <>
        <Upload
          action="/manage/img/upload" //处理图片上传的path
          name="image" //指定参数名
          listType="picture-card" //上传列表的内建样式 卡片样式
          fileList={fileList} //文件列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/**限制图片上传的最大个数为4,*/}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        {/**显示大图 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} /> 
        </Modal>
      </>
    )
  }
}
