import request from '@/utils/request'

export function resertPageitemsByPageid(data) {
  return request({
    url: '/api/page/resert-pageitems-by-pageid',
    method: 'post',
    data
  })
}

