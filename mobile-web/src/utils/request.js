import axios from "axios";
const service = axios.create({
  baseURL: "http://xtroms.com:5013/",
  // baseURL: "http://localhost:5013/",
  timeout: 60000,
});
const headers = {};

service.interceptors.request.use(
  (config) => {
    config.headers = headers;
    return config;
  },
  (err) => Promise.reject(err)
);
service.interceptors.response.use(
  (res) => {
    const { data } = res;
    if (data.code === 0) {
      return data;
    } else {
      return Promise.reject(data);
    }
  },
  (err) => {
    return Promise.reject(err.response.data);
  }
);
export default service;
