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

export const getCanvasData = ({
  userId,
  canvasId
}: {
  userId: any;
  canvasId: any;
}) =>
  request({
    url: `/api/canvas/imagedata/${userId}/${canvasId}`,
    method: "get"
  });

export const setPagesData = (data: any) =>
  request({
    url: "/api/pages/imagedata",
    method: "post",
    data: data
  });

export const getPagesData = ({
  userId,
  canvasId
}: {
  userId: any;
  canvasId: any;
}) =>
  request({
    url: `/api/pages/imagedata/${userId}/${canvasId}`,
    method: "get"
  });
