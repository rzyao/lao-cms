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
export function getUnitList(data) {
  return request({
    url: '/api/unit/list',
    method: 'post',
    data
  })
}
export function getUnitInfo(id) {
  return request({
    url: '/api/unit/info',
    method: 'get',
    params: { id }
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
export function queryList(data) {
  return request({
    url: '/api/unit/queryList',
    method: 'post',
    data
  })
}
export function queryUnitLike(data) {
  return request({
    url: '/api/unit/query-chinese-like',
    method: 'post',
    data
  })
}
