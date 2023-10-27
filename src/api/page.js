import request from '@/utils/request'

export function createPage(data) {
  return request({
    url: '/api/page/create',
    method: 'post',
    data
  })
}
export function updatePage(data) {
  return request({
    url: '/api/page/update',
    method: 'post',
    data
  })
}
export function getpageList(token) {
  return request({
    url: '/api/page/list',
    method: 'get',
    params: { token }
  })
}
export function getpageInfo(token) {
  return request({
    url: '/api/page/info',
    method: 'get',
    params: { token }
  })
}
export function deletepage(data) {
  return request({
    url: '/api/page/delete',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
