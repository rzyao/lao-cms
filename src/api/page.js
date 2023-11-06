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
export function getPageList(data) {
  return request({
    url: '/api/page/list',
    method: 'post',
    data
  })
}
export function getpageInfo(token) {
  return request({
    url: '/api/page/info',
    method: 'get',
    params: { token }
  })
}
export function deletePage(id) {
  return request({
    url: '/api/page/delete',
    method: 'post',
    data: { id: id }
  })
}
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
export function addItem(id) {
  return request({
    url: '/api/page/add_item',
    method: 'post',
    data: { id: id }
  })
}

export function getItemList(id) {
  return request({
    url: '/api/page/itemList',
    method: 'post',
    data: { id: id }
  })
}

export function getPagesAndItems(id) {
  return request({
    url: '/api/page/pages-and-items',
    method: 'post',
    data: { id: id }
  })
}
export function resertUnitAndPageRelationship(data) {
  return request({
    url: '/api/page/resert-relationship',
    method: 'post',
    data
  })
}
