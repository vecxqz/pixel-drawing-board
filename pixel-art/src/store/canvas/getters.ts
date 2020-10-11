import { GetterTree } from "vuex";
import { CanvasState } from "./type";
import { RootState } from "../type";
import { cell } from "../../../types/canvas";

const CanvasGetters: GetterTree<CanvasState, RootState> = {
  currentGridMeta: (state: CanvasState): cell => {
    const {
      pages,
      currentPageIndex,
      currentLayerIndex,
      currentColumnIndex,
      currentRowIndex
    } = state;
    let cell: cell | object;
    if (pages[currentPageIndex]?.layers) {
      cell =
        pages[currentPageIndex].layers[currentLayerIndex][currentColumnIndex][
          currentRowIndex
        ];
    } else {
      cell = {};
    }
    return cell as cell;
  }
};

export { CanvasGetters };
