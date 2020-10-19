import { CanvasState } from "./type";
import { RootState } from "../type";
import { ActionTree } from "vuex";
import { ActionsTypes, MutationsTypes } from "./enum";
const CanvasActions: ActionTree<CanvasState, RootState> = {
  [ActionsTypes.SET_PAINT_MODE]({ commit }, mode: string): void {
    commit(MutationsTypes.SET_PAINT_MODE, mode);
  },
  [ActionsTypes.CREATE_LAYER]({ commit }): void {
    commit(MutationsTypes.CREATE_LAYER);
  },
  [ActionsTypes.CREATE_TEMP_LAYER]({ commit }): void {
    commit(MutationsTypes.CREATE_TEMP_LAYER);
  },
  [ActionsTypes.CREATE_PAGE]({ commit }): void {
    commit(MutationsTypes.CREATE_PAGE);
  },
  [ActionsTypes.SET_CANVASCTX]({ commit }, canvas: HTMLCanvasElement): void {
    const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    commit(MutationsTypes.SET_CANVASCTX, canvasCtx);
  },
  [ActionsTypes.SET_COLOR]({ commit }, color: string): void {
    commit(MutationsTypes.SET_COLOR, color);
  },
  [ActionsTypes.SET_START_POINT](
    { commit },
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    commit(MutationsTypes.SET_START_POINT, { e, x, y });
  },
  [ActionsTypes.SET_END_POINT](
    { commit },
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    commit(MutationsTypes.SET_END_POINT, { e, x, y });
  },
  [ActionsTypes.SET_LASET_START_POINT](
    { commit },
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    commit(MutationsTypes.SET_LASET_START_POINT, { e, x, y });
  },
  [ActionsTypes.SET_LASET_END_POINT](
    { commit },
    { e, x, y }: { e: MouseEvent; x: number; y: number }
  ) {
    commit(MutationsTypes.SET_LASET_END_POINT, { e, x, y });
  },
  [ActionsTypes.SET_ROW_INDEX]({ commit }, index: number) {
    commit(MutationsTypes.SET_ROW_INDEX, index);
  },
  [ActionsTypes.SET_COLUMN_INDEX]({ commit }, index: number) {
    commit(MutationsTypes.SET_COLUMN_INDEX, index);
  },
  [ActionsTypes.SET_SELECT_AREA_START_COORDINATE](
    { commit },
    { x, y }: { x: number; y: number }
  ) {
    commit(MutationsTypes.SET_SELECT_AREA_START_COORDINATE, { x, y });
  },
  [ActionsTypes.SET_SELECT_AREA_END_COORDINATE](
    { commit },
    { x, y }: { x: number; y: number }
  ) {
    commit(MutationsTypes.SET_SELECT_AREA_END_COORDINATE, { x, y });
  },
  [ActionsTypes.SET_SELECT_AREA_DATA]({ commit }, data: Array<any>) {
    commit(MutationsTypes.SET_SELECT_AREA_DATA, data);
  },
  [ActionsTypes.SET_SELECT_AREA_SET_STATUS]({ commit }, setStatus) {
    commit(MutationsTypes.SET_SELECT_AREA_SET_STATUS, setStatus);
  }
};
export { CanvasActions };
