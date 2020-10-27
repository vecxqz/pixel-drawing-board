import { CanvasState } from "./type";
import { RootState } from "../type";
import { layer } from "../../../types/canvas";
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
  [ActionsTypes.SET_SHDOW_LAYER_CANVASCTX]({ commit }, canvas: HTMLCanvasElement): void {
    const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    commit(MutationsTypes.SET_SHDOW_LAYER_CANVASCTX, canvasCtx);
  },
  [ActionsTypes.SET_SELECTCANVASCTX](
    { commit },
    canvas: HTMLCanvasElement
  ): void {
    const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    commit(MutationsTypes.SET_SELECTCANVASCTX, canvasCtx);
  },
  [ActionsTypes.SET_COLOR]({ commit }, color: string): void {
    commit(MutationsTypes.SET_COLOR, color);
  },
  [ActionsTypes.SET_PRIMARY_COLOR]({ commit }, color: string): void {
    commit(MutationsTypes.SET_PRIMARY_COLOR, color);
  },
  [ActionsTypes.SET_SECONDARY_COLOR]({ commit }, color: string): void {
    commit(MutationsTypes.SET_SECONDARY_COLOR, color);
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
  [ActionsTypes.SET_SELECT_AREA_DATA](
    { commit },
    {
      currentLayer,
      startX,
      startY,
      endX,
      endY
    }: {
      currentLayer: layer;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  ) {
    const minX = Math.min(startX, endX);
    const minY = Math.min(startY, endY);
    const maxX = Math.max(startX, endX);
    const maxY = Math.max(startY, endY);
    let data: Array<any> = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const dataIndexX = x - minX;
        const dataIndexY = y - minY;
        if (!Array.isArray(data[dataIndexX])) {
          data[dataIndexX] = [];
        }
        data[dataIndexX][dataIndexY] = { ...currentLayer[x][y] };
      }
    }
    commit(MutationsTypes.SET_SELECT_AREA_DATA, data);
  },
  [ActionsTypes.SET_LAYER_GRID_DATA](
    { commit },
    {
      columnIndex,
      rowIndex,
      data
    }: { columnIndex: number; rowIndex: number; data: any }
  ) {
    commit(MutationsTypes.SET_LAYER_GRID_DATA, {
      columnIndex,
      rowIndex,
      data
    });
  }
};
export { CanvasActions };
