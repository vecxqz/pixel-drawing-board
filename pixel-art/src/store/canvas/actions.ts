import { CanvasState } from "./type";
import { RootState } from "../type";
import { ActionTree } from "vuex";
import { ActionsTypes, MutationsTypes } from "../../enum/canvas";
const CanvasActions: ActionTree<CanvasState, RootState> = {
  [ActionsTypes.SET_PAINT_MODE]({ commit }, mode: string): void {
    console.log(mode);
    commit(MutationsTypes.SET_PAINT_MODE, mode);
  },
  [ActionsTypes.CREATE_LAYER]({ commit }): void {
    commit(MutationsTypes.CREATE_LAYER);
  },
  [ActionsTypes.CREATE_PAGE]({ commit }): void {
    commit(MutationsTypes.CREATE_PAGE);
  }
};
export { CanvasActions };
