import request from './request';

let baseUrl = '/books';

export function getAppList(params) {
  return request({
    method: 'get',
    url: baseUrl + '/app/queryList',
    params
  });
}

export function saveData(params) {
  return request({
    method: 'post',
    url: baseUrl + '/app/save',
    params
  });
}
