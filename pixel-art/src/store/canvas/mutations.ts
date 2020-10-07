import { MutationTree } from "vuex";
import { CanvasState } from "./type";
import { Mutation } from "vuex";
import { MutationsTypes } from "../../enum/canvas";

const CanvasMutations: MutationTree<CanvasState> = {
  [MutationsTypes.SET_PAINT_MODE](state: CanvasState, mode: string) {
    state.mode = mode;
  }
};
export { CanvasMutations };
