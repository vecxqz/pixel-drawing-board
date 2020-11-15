import { request } from "./index";

export const getGuid = () =>
  request({
    url: "/api/canvas/guid",
    method: "GET"
  });
export const setCanvasData = (data: any) =>
  request({
    url: "/api/canvas/imagedata",
    method: "post",
    data: data
  });

export const getCanvasData = ({ canvasId }: { canvasId: any }) =>
  request({
    url: `/api/canvas/imagedata/${canvasId}`,
    method: "get"
  });

export const setPagesData = (data: any) =>
  request({
    url: "/api/pages/imagedata",
    method: "post",
    data: data
  });

export const getPagesData = ({ canvasId }: { canvasId: any }) =>
  request({
    url: `/api/pages/imagedata/${canvasId}`,
    method: "get"
  });

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
