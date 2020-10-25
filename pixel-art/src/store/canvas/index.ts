import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { CanvasGetters } from "./getters";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: () => ({
    mode: "pencil",
    color: "black",
    currentLayerIndex: 0,
    currentPageIndex: 0,
    currentRowIndex: 0,
    currentColumnIndex: 0,
    pages: [],
    width: 800,
    height: 800,
    size: 10,
    tempLayer: [],
    canvasCtx: undefined,
    selectCanvasCtx: undefined,
    selectArea: {
      isSet: false,
      isMove: false,
      isClickOut: false,
      startX: undefined,
      startY: undefined,
      endX: undefined,
      endY: undefined,
      data: undefined
    },
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
  },
  getters: {
    ...CanvasGetters
  }
};
export default module;
