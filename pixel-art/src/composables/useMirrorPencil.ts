import { drawGrid, bresenhamLine } from "../util/canvas";
import { computed, reactive, ref } from "vue";
import { useStore } from "./useStore";
export function useMirrorPencil(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const width = computed(
    () => store.state.canvasModule.width / store.state.canvasModule.size
  );
  const shadowLayerCanvasCtx = computed(
    () => store.state.canvasModule.shadowLayerCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex]
  );
  const mode = ref("pen");
  const mouseMoveStart = reactive({
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0
  });

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const mirrorColumnIndex = width.value - columnIndex - 1;
    if (e.button === 0) {
      mode.value = "pen";
      drawGrid(
        canvasCtx.value,
        currentLayer.value,
        columnIndex,
        rowIndex,
        color.value
      );
      store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
        columnIndex,
        rowIndex,
        data: {
          color: color.value
        }
      });
      drawGrid(
        canvasCtx.value,
        currentLayer.value,
        mirrorColumnIndex,
        rowIndex,
        color.value
      );
      store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        data: {
          color: color.value
        }
      });
    }
    if (e.button === 2) {
      mode.value = "clear";
      const { backgroundColor: color } = currentLayer.value[columnIndex][
        rowIndex
      ];
      const { backgroundColor: mirrorColor } = currentLayer.value[
        mirrorColumnIndex
      ][rowIndex];
      drawGrid(
        canvasCtx.value,
        currentLayer.value,
        columnIndex,
        rowIndex,
        color
      );
      store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
        columnIndex,
        rowIndex,
        data: {
          color: undefined
        }
      });
      drawGrid(
        canvasCtx.value,
        currentLayer.value,
        mirrorColumnIndex,
        rowIndex,
        mirrorColor
      );
      store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        data: {
          color: undefined
        }
      });
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }

  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const mirrorColumnIndex = width.value - columnIndex - 1;
    mouseMoveStart.currentX = columnIndex;
    mouseMoveStart.currentY = rowIndex;
    if (mode.value === "pen") {
      // 如果是缓慢移动鼠标就不使用布雷森汉姆直线算法
      if (
        Math.abs(mouseMoveStart.lastX - mouseMoveStart.currentX) <= 1 &&
        Math.abs(mouseMoveStart.lastY - mouseMoveStart.currentY) <= 1
      ) {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex,
          rowIndex,
          data: {
            color: color.value
          }
        });
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          mirrorColumnIndex,
          rowIndex,
          color.value
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          data: {
            color: color.value
          }
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            drawGrid(
              canvasCtx.value,
              currentLayer.value,
              columnIndex,
              rowIndex,
              color.value
            );
            store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
              columnIndex,
              rowIndex,
              data: {
                color: color.value
              }
            });
            drawGrid(
              canvasCtx.value,
              currentLayer.value,
              mirrorColumnIndex,
              rowIndex,
              color.value
            );
            store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              data: {
                color: color.value
              }
            });
          }
        );
      }
    }
    if (mode.value === "clear") {
      const { backgroundColor: color } = currentLayer.value[columnIndex][
        rowIndex
      ];
      const { backgroundColor: mirrorColor } = currentLayer.value[
        mirrorColumnIndex
      ][rowIndex];
      // 如果是缓慢移动鼠标就不使用布雷森汉姆直线算法
      if (
        Math.abs(mouseMoveStart.lastX - mouseMoveStart.currentX) <= 1 &&
        Math.abs(mouseMoveStart.lastY - mouseMoveStart.currentY) <= 1
      ) {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex,
          rowIndex,
          data: {
            color: undefined
          }
        });
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          mirrorColumnIndex,
          rowIndex,
          mirrorColor
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          data: {
            color: undefined
          }
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            drawGrid(
              canvasCtx.value,
              currentLayer.value,
              columnIndex,
              rowIndex,
              color
            );
            store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
              columnIndex,
              rowIndex,
              data: {
                color: undefined
              }
            });
            drawGrid(
              canvasCtx.value,
              currentLayer.value,
              mirrorColumnIndex,
              rowIndex,
              mirrorColor
            );
            store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              data: {
                color: undefined
              }
            });
          }
        );
      }
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }
  function mouseUp(this: any, e: MouseEvent) {
    console.log("pencil mouseUp");
    mouseMoveStart.currentX = 0;
    mouseMoveStart.currentY = 0;
    mouseMoveStart.lastX = 0;
    mouseMoveStart.lastY = 0;
  }
  return { mouseDown, mouseMove, mouseUp };
}
