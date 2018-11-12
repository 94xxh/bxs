import request from '@/utils/request'
const qs = require('qs')
export function login(username, password) {
  console.log(username)
  console.log(password)
  const grant_type = 'password'
  const client_id = 2
  const client_secret = '8imgP9bqwtvrPTfbpofOTIv1sKuNcMLLgnn4X2o3'
  const postData = {
    username,
    password,
    grant_type,
    client_id,
    client_secret
  }
  return request({
    url: '/oauth/token',
    method: 'post',
    data: qs.stringify(postData)
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
