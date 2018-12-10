/**
 * 文章管理接口
 * created by xxh on 2018-11-12
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取文章列表
export function getList(params) {
  const orderby = params.id ? params.id : 'id' // 默认按id
  const order = params.order ? params.order : 'desc' // 默认正序
  return request({
    url: '/api/article/index/' + params.pagenum + '/' + orderby + '/' + order + '?page=' + params.page,
    method: 'get'
    // params: {
    //   params
    // }
  })
}

//  新建文章
export function saveArticle(postData) {
  return request({
    url: '/api/article/save',
    method: 'post',
    data: qs.stringify(postData)
  })
}

//  更新文章
export function updateArticle(id, postData) {
  return request({
    url: '/api/article/update/' + id,
    method: 'post',
    data: qs.stringify(postData)
  })
}

//  删除
export function handleDel(id) {
  return request({
    url: '/api/article/delete/' + id,
    method: 'delete'
  })
}

//  读取指定
export function handleRead(id) {
  return request({
    url: '/api/article/read/' + id,
    method: 'get'
  })
}
