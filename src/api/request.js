import axios from 'axios';
const request = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
request.interceptors.request.use(config => {
  return config;
});

request.interceptors.response.use(
  response => {
    // const data = response.data;
    // const { code, redirectUrl = '' } = data;
    // if (code == 40001) {
    //   window.location.href = redirectUrl;
    // } else {
    //   return response;
    // }
    debugger;
    return response.data;
  },
  error => {
    Promise.reject(error);
    return error;
  }
);
export default request;
