import { MutationTree } from "vuex";
import { CanvasState } from "./type";
import { Mutation } from "vuex";
import { MutationsTypes } from "./enum";
import { cell, layer, page } from "types/canvas";
import { initLayer } from "../../util/canvas";
const CanvasMutations: MutationTree<CanvasState> = {
  [MutationsTypes.SET_PAINT_MODE](state: CanvasState, mode: string) {
    state.mode = mode;
  },
  [MutationsTypes.CREATE_LAYER](state: CanvasState) {
    const layer: layer = [];
    const { currentPageIndex, currentLayerIndex } = state;
    const page = state.pages[currentPageIndex];
  },
  [MutationsTypes.CREATE_PAGE](state: CanvasState) {
    const { width, height } = state;
    const layer: layer = initLayer(width, height, 10);
    state.pages.push({
      layers: [layer]
    });
    console.log(state);
  },
  [MutationsTypes.SET_CANVASCTX](
    state: CanvasState,
    canvasCtx: CanvasRenderingContext2D
  ) {
    state.canvasCtx = canvasCtx;
  },
  [MutationsTypes.SET_COLOR](state: CanvasState, color: string) {
    console.log(color)
    state.color = color;
  },
  [MutationsTypes.SET_START_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (e) {
      state.eventPoint.startPoint.e = e;
    }
    if (x) {
      state.eventPoint.startPoint.x = x;
    }
    if (y) {
      state.eventPoint.startPoint.y = y;
    }
  },
  [MutationsTypes.SET_END_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (e) {
      state.eventPoint.endPoint.e = e;
    }
    if (x) {
      state.eventPoint.endPoint.x = x;
    }
    if (y) {
      state.eventPoint.endPoint.y = y;
    }
  },
  [MutationsTypes.SET_LASET_START_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (e) {
      state.eventPoint.lastStartPoint.e = e;
    }
    if (x) {
      state.eventPoint.lastStartPoint.x = x;
    }
    if (y) {
      state.eventPoint.lastStartPoint.y = y;
    }
  },
  [MutationsTypes.SET_LASET_END_POINT](
    state: CanvasState,
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    if (e) {
      state.eventPoint.lastEndPoint.e = e;
    }
    if (x) {
      state.eventPoint.lastEndPoint.x = x;
    }
    if (y) {
      state.eventPoint.lastEndPoint.y = y;
    }
  }
};
export { CanvasMutations };
