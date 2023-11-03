import request from '@/utils/request'

export function getColumnList(data) {
  return request({
    url: '/api/column/list',
    method: 'post',
    data
  })
}
export function createColumn(data) {
  return request({
    url: '/api/column/create',
    method: 'post',
    data
  })
}
export function deleteColumn(data) {
  return request({
    url: '/api/column/remove',
    method: 'post',
    data: { id: data }
  })
}
export function updateColumn(data) {
  return request({
    url: '/api/column/update',
    method: 'post',
    data
  })
}
