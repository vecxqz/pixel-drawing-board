import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { CanvasGetters } from "./getters";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: (): CanvasState => ({
    mode: "pencil",
    color: "rgb(0,0,0)",
    primaryColor: "rgb(0,0,0)",
    secondaryColor: "rgb(255,255,255)",
    currentPageIndex: 0,
    currentLayerIndex: 0,
    currentRowIndex: 0,
    currentColumnIndex: 0,
    pages: [] as any,
    width: 32,
    height: 32,
    canvasMetaHeight: 0,
    canvasMetaWidth: 0,
    size: 1,
    scale: 1,
    selectCanvasCtx: undefined as any,
    aboveCanvasCtx: undefined as any,
    canvasCtx: undefined as any,
    belowCanvasCtx: undefined as any,
    backgroundCanvasCtx: undefined as any,
    shadowLayerCanvasCtx: undefined as any,
    tempCanvasCtx: {} as any,
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
    } as any,
    selectArea: {
      isSet: false,
      isMove: false,
      isClickOutSide: true,
      startX: undefined,
      startY: undefined,
      endX: undefined,
      endY: undefined,
      data: undefined
    } as any,
    previewUrl: "",
    redo: [],
    undo: [],
    animationSpeed: 1000,
    guid: ""
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
