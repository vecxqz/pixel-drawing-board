import { bresenhamLine, drawGridB } from "../utils/canvas";
import { computed } from "vue";
import { useWrapStore } from "../store/index";
import { useMousePosition } from "./usePosition";
export function useLine() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const { startX, startY, endX, endY } = useMousePosition();

  function mouseDown(e: MouseEvent) {
    console.log("line mouse move");
  }

  function mouseMove(e: MouseEvent) {
    bresenhamLine(
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
  
  function mouseUp(e: MouseEvent) {
    console.log(startX.value, startY.value, endX.value, endY.value);
    bresenhamLine(
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
