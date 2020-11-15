import axios, { AxiosResponse } from "axios";
import { get } from "js-cookie";
const request = axios.create();
request.interceptors.request.use(config => {
  const token = get("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});
request.interceptors.response.use(
  response => {
    const { data, status } = response;
    if (status >= 400) {
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  },
  error => Promise.reject(error)
);
export { request };
