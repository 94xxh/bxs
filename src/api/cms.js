/**
 * git管理接口
 * created by xxh on 2018-11-12
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取文章列表
export function getList(params) {
  return request({
    url: '/api/article/index',
    method: 'get',
    params: {
      params
    }
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
