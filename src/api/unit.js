import request from '@/utils/request'

export function submitUnitInfo(data) {
  return request({
    url: '/api/unit/upload',
    method: 'post',
    data
  })
}
export function updateUnitInfo(data) {
  return request({
    url: '/api/unit/update',
    method: 'post',
    data
  })
}
export function getUnitList(token) {
  return request({
    url: '/api/unit/list',
    method: 'get',
    params: { token }
  })
}
export function getUnitInfo(token) {
  return request({
    url: '/api/unit/info',
    method: 'get',
    params: { token }
  })
}
export function deleteUnit(data) {
  return request({
    url: '/api/unit/delete',
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
