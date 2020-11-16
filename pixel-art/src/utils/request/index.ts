import axios, { AxiosResponse } from "axios";
import { get } from "js-cookie";
import { useMessage } from "element3";
const request = axios.create();
const message = useMessage();
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
      message.error(msg);
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  },
  error => error
);
export { request };
