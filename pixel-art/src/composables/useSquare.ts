import { drawSquare, drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useSquare(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex].layer
  );
  const { startX, startY, endX, endY } = useMousePosition();

  function mouseDown(this: any, e: MouseEvent) {
    console.log("square mouseDown");
  }
  // 拖拽时绘制矩形
  function mouseMove(this: any, e: MouseEvent) {
    drawSquare(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
      }
    );
  }
  // 鼠标松开时，把矩形绘制，并修改数据
  function mouseUp(this: any, e: MouseEvent) {
    drawSquare(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
      }
    );
  }

  return { mouseDown, mouseMove, mouseUp };
}
