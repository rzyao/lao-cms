import request from '@/utils/request'

export function getColumnList(data) {
  return request({
    url: '/api/column/getColumnList',
    method: 'post',
    data
  })
}
export function oploadColumnList(data) {
  return request({
    url: '/api/column/oploadColumnList',
    method: 'post',
    data
  })
}
