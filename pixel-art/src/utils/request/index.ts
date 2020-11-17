import axios, { AxiosResponse } from "axios";
import { get } from "js-cookie";
import { Message } from "element-plus/lib/message";
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
    const { data } = response;
    const { code, msg } = data;
    if (code >= 400) {
      Message({
        type: "error",
        message: msg
      });
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  },
  error => error
);
export { request };
