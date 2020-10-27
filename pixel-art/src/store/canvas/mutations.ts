import { MutationTree } from "vuex";
import { CanvasState } from "./type";
import { Mutation } from "vuex";
import { MutationsTypes } from "./enum";
import { canvasData, cell, layer, page } from "types/canvas";
import { initLayer } from "../../util/canvas";
import { isUndefined } from "../../util/common";

const CanvasMutations: MutationTree<CanvasState> = {
  [MutationsTypes.SET_PAINT_MODE](state: CanvasState, mode: string) {
    state.mode = mode;
  },
  [MutationsTypes.CREATE_LAYER](state: CanvasState) {
    const layer: layer = [];
    const { currentPageIndex, currentLayerIndex } = state;
    const page = state.pages[currentPageIndex];
  },
  [MutationsTypes.CREATE_TEMP_LAYER](state: CanvasState) {
    const { width, height } = state;
    const layer: layer = initLayer(width, height, 10);
    state.tempLayer = layer;
  },
  [MutationsTypes.CREATE_PAGE](state: CanvasState) {
    const { width, height } = state;
    const layer: layer = initLayer(width, height, 10);
    state.pages.push({
      layers: [layer]
    });
  },
  [MutationsTypes.SET_CANVASCTX](
    state: CanvasState,
    canvasCtx: CanvasRenderingContext2D
  ) {
    state.canvasCtx = canvasCtx;
  },
  [MutationsTypes.SET_SELECTCANVASCTX](
    state: CanvasState,
    canvasCtx: CanvasRenderingContext2D
  ) {
    state.selectCanvasCtx = canvasCtx;
  },
  [MutationsTypes.SET_COLOR](state: CanvasState, color: string) {
    state.color = color;
  },
  [MutationsTypes.SET_PRIMARY_COLOR](state: CanvasState, color: string) {
    state.primaryColor = color;
  },
  [MutationsTypes.SET_SECONDARY_COLOR](state: CanvasState, color: string) {
    state.secondaryColor = color;
  },
  [MutationsTypes.SET_START_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (!isUndefined(e)) {
      state.eventPoint.startPoint.e = e;
    }
    if (!isUndefined(x)) {
      state.eventPoint.startPoint.x = x;
    }
    if (!isUndefined(y)) {
      state.eventPoint.startPoint.y = y;
    }
  },
  [MutationsTypes.SET_END_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (!isUndefined(e)) {
      state.eventPoint.endPoint.e = e;
    }
    if (!isUndefined(x)) {
      state.eventPoint.endPoint.x = x;
    }
    if (!isUndefined(y)) {
      state.eventPoint.endPoint.y = y;
    }
  },
  [MutationsTypes.SET_LASET_START_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (!isUndefined(e)) {
      state.eventPoint.lastStartPoint.e = e;
    }
    if (!isUndefined(x)) {
      state.eventPoint.lastStartPoint.x = x;
    }
    if (!isUndefined(y)) {
      state.eventPoint.lastStartPoint.y = y;
    }
  },
  [MutationsTypes.SET_LASET_END_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (!isUndefined(e)) {
      state.eventPoint.lastEndPoint.e = e;
    }
    if (!isUndefined(x)) {
      state.eventPoint.lastEndPoint.x = x;
    }
    if (!isUndefined(y)) {
      state.eventPoint.lastEndPoint.y = y;
    }
  },
  [MutationsTypes.SET_ROW_INDEX](state: CanvasState, index: number) {
    state.currentRowIndex = index;
  },
  [MutationsTypes.SET_COLUMN_INDEX](state: CanvasState, index: number) {
    state.currentColumnIndex = index;
  },
  [MutationsTypes.SET_SELECT_AREA_START_COORDINATE](
    state: CanvasState,
    { x, y }: { x: number; y: number }
  ) {
    state.selectArea.startX = x;
    state.selectArea.startY = y;
  },
  [MutationsTypes.SET_SELECT_AREA_END_COORDINATE](
    state: CanvasState,
    { x, y }: { x: number; y: number }
  ) {
    state.selectArea.endX = x;
    state.selectArea.endY = y;
  },
  [MutationsTypes.SET_SELECT_AREA_DATA](state: CanvasState, data) {
    state.selectArea.data = data;
  },
  [MutationsTypes.SET_SELECT_AREA_SET_STATUS](state: CanvasState, setStatus) {
    state.selectArea.isSet = setStatus;
  },
  [MutationsTypes.SET_SELECT_AREA_MOVE_STATUS](state: CanvasState, moveStatus) {
    state.selectArea.isMove = moveStatus;
  },
  [MutationsTypes.SET_SELECT_AREA_CLICK_OUT_STATUS](
    state: CanvasState,
    outStatus
  ) {
    state.selectArea.isClickOut = outStatus;
  },
  [MutationsTypes.SET_LAYER_GRID_DATA](
    state: CanvasState,
    {
      columnIndex,
      rowIndex,
      data
    }: { columnIndex: number; rowIndex: number; data: any }
  ) {
    const { currentPageIndex, currentLayerIndex } = state;
    state.pages[currentPageIndex].layers[currentLayerIndex][columnIndex][
      rowIndex
    ] = {
      ...state.pages[currentPageIndex].layers[currentLayerIndex][columnIndex][
        rowIndex
      ],
      ...data
    };
  }
};
export { CanvasMutations };
