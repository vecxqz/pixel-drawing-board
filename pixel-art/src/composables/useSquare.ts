import { drawSquare, drawGridB } from "../utils/canvas";
import { computed } from "vue";
import { useWrapStore } from "../store/index";
import { useMousePosition } from "./usePosition";
export function useSquare() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const { startX, startY, endX, endY } = useMousePosition();

  function mouseDown(e: MouseEvent) {
    console.log("square mouseDown");
  }
  // 拖拽时绘制矩形
  function mouseMove(e: MouseEvent) {
    drawSquare(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
      }
    );
  }
  // 鼠标松开时，把矩形绘制，并修改数据
  function mouseUp(e: MouseEvent) {
    drawSquare(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
      }
    );
  }

  return { mouseDown, mouseMove, mouseUp };
}
