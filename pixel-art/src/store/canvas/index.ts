import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: () => ({
    mode: "pecil",
    color: "#000",
    currentLayerIndex: 0,
    currentPageIndex: 0,
    pages: [],
    width: 800,
    height: 800,
    size: 10,
    tempLayer: [],
    canvasCtx: undefined,
    eventPoint: {
      startPoint: {
        e: undefined,
        x: undefined,
        y: undefined
      },
      endPoint: {
        e: undefined,
        x: undefined,
        y: undefined
      },
      lastStartPoint: {
        e: undefined,
        x: undefined,
        y: undefined
      },
      lastEndPoint: {
        e: undefined,
        x: undefined,
        y: undefined
      }
    }
  }),
  mutations: {
    ...CanvasMutations
  },
  actions: {
    ...CanvasActions
  }
};
export default module;
