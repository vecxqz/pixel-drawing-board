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

export const getAllPagesData = () =>
  request({
    url: `/api/pages/imagedata`,
    method: "get"
  });

export const getAllPublicPagesData = () =>
  request({
    url: `/api/pages/public-imagedata`,
    method: "get"
  });

export const removePagesData = (guid: string) =>
  request({
    url: `/api/pages/delete/${guid}`,
    method: "post"
  });

export const setPageTitle = ({
  guid,
  title
}: {
  guid: string;
  title: string;
}) =>
  request({
    url: `/api/pages/title/${guid}`,
    method: "post",
    data: { title }
  });
