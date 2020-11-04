import { GetterTree } from "vuex";
import { CanvasState } from "./type";
import { RootState } from "../type";

const CanvasGetters: GetterTree<CanvasState, RootState> = {
  currentGridMeta: (state: CanvasState): any => {
    const { currentColumnIndex, currentRowIndex } = state;
    return {
      columnIndex: currentColumnIndex,
      rowIndex: currentRowIndex
    };
  }
};

export { CanvasGetters };
