/**
 * git管理接口
 * created by xxh on 2018-11-15
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取列表
export function getList(params) {
  return request({
    url: '/api/company/index',
    method: 'get',
    params: {
      params
    }
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

