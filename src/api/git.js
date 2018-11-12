/**
 * git管理接口
 * created by xxh on 2018-11-12
 */
const qs = require('qs')
import request from '@/utils/request'

//  获取项目列表
export function getList(params) {
  return request({
    url: '/api/project/index',
    method: 'get',
    params: {
      params
    }
  })
}
