/**
 * 项目管理接口
 * created by xxh on 2018-10-12
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取项目列表
export function getList(params) {
  const orderby = params.id ? params.id : 'id' // 默认按id
  const order = params.order ? params.order : 'desc' // 默认正序
  return request({
    url: '/api/project/index/' + params.pagenum + '/' + orderby + '/' + order + '?page=' + params.page,
    method: 'get'
    // params: {
    //   params
    // }
  })
}

//  获取指定项目
export function getProject(id) {
  return request({
    url: '/api/project/read/' + id,
    method: 'get'
  })
}

//  删除项目
export function delProject(id) {
  return request({
    url: '/api/project/delete/' + id,
    method: 'delete'
    // data: qs.stringify(postData)
  })
}

//  修改项目
export function updateProject(id, postData) {
  return request({
    url: '/api/project/update/' + id,
    method: 'post',
    data: qs.stringify(postData)
  })
}

//  新建项目
export function saveProject(postData) {
  return request({
    url: '/api/project/save',
    method: 'post',
    data: qs.stringify(postData)
  })
}
