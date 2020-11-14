import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { CanvasGetters } from "./getters";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: () => ({
    mode: "pencil",
    color: "rgb(100, 200, 150)",
    primaryColor: "rgb(10, 200, 150)",
    secondaryColor: "rgb(190, 255, 255)",
    currentLayerIndex: 0,
    currentPageIndex: 0,
    currentRowIndex: 0,
    currentColumnIndex: 0,
    previewUrl: "",
    pages: [],
    guid: "",
    width: 64,
    height: 64,
    gridSize: 1,
    size: 1,
    tempLayer: [],
    canvasCtx: undefined,
    selectCanvasCtx: undefined,
    aboveCanvasCtx: undefined,
    backgroundCanvasCtx: undefined,
    belowCanvasCtx: undefined,
    shadowLayerCanvasCtx: undefined,
    tempCanvasCtx: undefined,
    imageData: undefined,
    animationSpeed: 1000,
    undo: [],
    redo: [],
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
