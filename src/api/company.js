/**
 * 公司管理接口
 * created by xxh on 2018-11-15
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取列表
export function getList(params) {
  const orderby = params.id ? params.id : 'id' // 默认按id
  const order = params.order ? params.order : 'desc' // 默认正序
  return request({
    url: '/api/company/index/' + params.pagenum + '/' + orderby + '/' + order + '?page=' + params.page,
    method: 'get'
    // params: {
    //   params
    // }
  })
}

//  新增
export function saveCompany(postData) {
  return request({
    url: '/api/company/save',
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
    url: '/api/company/delete/' + id,
    method: 'delete'
  })
}

/**
 * 读取
 * @param {*} id  公司id
 */
export function handleRed(id) {
  return request({
    url: '/api/company/read/' + id,
    method: 'get'
  })
}

//  修改
export function updateCompany(postData, id) {
  return request({
    url: '/api/company/update/' + id,
    method: 'post',
    data: qs.stringify(postData)
  })
}
