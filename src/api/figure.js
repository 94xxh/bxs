/**
 * 人物管理接口
 * created by xxh on 2018-11-12
 */
const qs = require('qs')
import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params 分页等参数
 */
export function getList(params) {
  return request({
    url: '/api/figure/index',
    method: 'get',
    params: {
      params
    }
  })
}

/**
 * 获取指定信息
 * @param {*} id 指定对象id
 */
export function handleRed(id) {
  return request({
    url: '/api/figure/read/' + id,
    method: 'get'
  })
}

/**
 * 删除指定人物
 * @param {*} id  人物id
 */
export function handleDel(id) {
  return request({
    url: '/api/figure/delete/' + id,
    method: 'delete'
  })
}

/**
 * 新增人物
 * @param {*} postData
 */
export function handleSave(postData) {
  return request({
    url: '/api/figure/save',
    method: 'post',
    data: qs.stringify(postData)
  })
}

/**
 * 编辑人物
 * @param {*} postData
 */
export function handleUpdate(id, postData) {
  return request({
    url: '/api/figure/update/' + id,
    method: 'post',
    data: qs.stringify(postData)
  })
}
