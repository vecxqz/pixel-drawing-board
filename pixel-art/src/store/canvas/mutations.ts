import { MutationTree } from "vuex";
import { CanvasState } from "./type";
import { Mutation } from "vuex";
import { MutationsTypes } from "../../enum/canvas";
import { cell, layer, page } from "types/canvas";
import { initLayer } from "../../util/canvas";
const CanvasMutations: MutationTree<CanvasState> = {
  [MutationsTypes.SET_PAINT_MODE](state: CanvasState, mode: string) {
    state.mode = mode;
  },
  [MutationsTypes.CREATE_LAYER](state: CanvasState) {
    const layer: layer = {};
    const { currentPageIndex, currentLayerIndex } = state;
    const page = state.pages[currentPageIndex];
    // const layers = state.pages[currentPageIndex].layers
    // state.pages[currentPageIndex].layers[currentLayerIndex].push(layer);
  },
  [MutationsTypes.CREATE_PAGE](state: CanvasState) {
    const { width, height } = state;
    const layer: layer = initLayer(width, height, 10);
    state.pages.push({
      layers: [layer]
    });
    console.log(state)
  }
};
export { CanvasMutations };
