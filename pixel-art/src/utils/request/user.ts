import { request } from "./index";

export const login = ({
  username,
  password
}: {
  username: string;
  password: string;
}) =>
  request({
    url: `/api/auth/jwt-login`,
    method: "post",
    data: {
      username,
      password
    }
  });

export const register = ({
  username,
  password
}: {
  username: string;
  password: string;
}) =>
  request({
    url: `/api/auth/jwt-register`,
    method: "post",
    data: {
      username,
      password
    }
  });
