/**
 * 分类管理接口
 * created by xxh on 2018-11-15
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取列表
export function getList(params) {
  const orderby = params.id ? params.id : 'id' // 默认按id
  const pid = params.pid ? params.pid : 5 // 默认5
  const order = params.order ? params.order : 'desc' // 默认正序
  return request({
    url: '/api/category/index/' + pid + '/' + params.pagenum + '/' + orderby + '/' + order + '?page=' + params.page,
    method: 'get'
    // params: {
    //   params
    // }
  })
}

//  读取指定
export function handleRead(id) {
  return request({
    url: '/api/category/read/' + id,
    method: 'get'
  })
}

//  新增
export function handleSave(postData) {
  return request({
    url: '/api/category/save',
    method: 'post',
    data: qs.stringify(postData)
  })
}

// 更新
export function handleUpdate(id, postData) {
  return request({
    url: '/api/category/update/' + id,
    method: 'post',
    data: qs.stringify(postData)
  })
}

/**
 * 删除
 * @param {*} id  公司id
 */
export function handleDel(id) {
  return request({
    url: '/api/category/delete/' + id,
    method: 'delete'
  })
}
