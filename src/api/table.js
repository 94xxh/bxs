import request from '@/utils/request'

// 获取列表
export function getList(params) {
  const orderby = params.id ? params.id : 'id' // 默认按id
  const order = params.order ? params.order : 'desc' // 默认正序
  return request({
    url: '/api/table/index/' + params.pagenum + '/' + orderby + '/' + order + '?page=' + params.page,
    method: 'get'
    // params: {
    //   params
    // }
  })
}
