import { drawSquare, drawGridB } from "../util/canvas";
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
  function mouseUp(this: any, e: MouseEvent) {
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
