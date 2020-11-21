import { drawGridB, clearGridB, bresenhamLine } from "../utils/canvas";
import { computed, reactive, ref } from "vue";
import { useWrapStore } from "../store/index";
export function useMirrorPencil() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const width = computed(() => store.state.canvasModule.width);
  const shadowLayerCanvasCtx = computed(
    () => store.state.canvasModule.shadowLayerCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const mode = ref("pen");
  const mouseMoveStart = reactive({
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0
  });

  function mouseDown(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const mirrorColumnIndex = width.value - columnIndex - 1;
    if (e.button === 0) {
      mode.value = "pen";
      drawGridB(canvasCtx.value, {
        columnIndex,
        rowIndex,
        color: color.value,
        size: 1
      });
      drawGridB(canvasCtx.value, {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        color: color.value,
        size: 1
      });
    }
    if (e.button === 2) {
      mode.value = "clear";
      clearGridB(canvasCtx.value, {
        columnIndex,
        rowIndex,
        size: 1
      });
      clearGridB(canvasCtx.value, {
        columnIndex: mirrorColumnIndex,
        rowIndex,
        size: 1
      });
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }

  function mouseMove(e: MouseEvent) {
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
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
        drawGridB(canvasCtx.value, {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            drawGridB(canvasCtx.value, {
              columnIndex,
              rowIndex,
              color: color.value,
              size: 1
            });
            drawGridB(canvasCtx.value, {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              color: color.value,
              size: 1
            });
          }
        );
      }
    }
    if (mode.value === "clear") {
      // 如果是缓慢移动鼠标就不使用布雷森汉姆直线算法
      if (
        Math.abs(mouseMoveStart.lastX - mouseMoveStart.currentX) <= 1 &&
        Math.abs(mouseMoveStart.lastY - mouseMoveStart.currentY) <= 1
      ) {
        clearGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          size: 1
        });
        clearGridB(canvasCtx.value, {
          columnIndex: mirrorColumnIndex,
          rowIndex,
          size: 1
        });
      } else {
        bresenhamLine(
          mouseMoveStart.lastX,
          mouseMoveStart.lastY,
          mouseMoveStart.currentX,
          mouseMoveStart.currentY,
          (columnIndex: number, rowIndex: number) => {
            const mirrorColumnIndex = width.value - columnIndex - 1;
            clearGridB(canvasCtx.value, {
              columnIndex,
              rowIndex,
              size: 1
            });
            clearGridB(canvasCtx.value, {
              columnIndex: mirrorColumnIndex,
              rowIndex,
              size: 1
            });
          }
        );
      }
    }
    mouseMoveStart.lastX = columnIndex;
    mouseMoveStart.lastY = rowIndex;
  }
  function mouseUp(e: MouseEvent) {
    console.log("pencil mouseUp");
    mouseMoveStart.currentX = 0;
    mouseMoveStart.currentY = 0;
    mouseMoveStart.lastX = 0;
    mouseMoveStart.lastY = 0;
  }
  return { mouseDown, mouseMove, mouseUp };
}
