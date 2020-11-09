import { ScanLineFill, boundaryFill4 } from "../utils/fill";
import { computed } from "vue";
import { useCanvas } from "./useCanvas";
import { useStore } from "./useStore";

export function useBucket(this: any) {
  const { calcColor } = useCanvas();
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const width = computed(() => {
    return store.state.canvasModule.width;
  });
  const height = computed(() => {
    return store.state.canvasModule.height;
  });
  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    // const oldColor = currentLayer.value[columnIndex][rowIndex].color,
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const oldColor = calcColor(imageData, columnIndex, rowIndex).rgb,
      newColor = color.value;
    // 传入的是原始对象,提高算法性能
    if (oldColor !== newColor) {
      const boundaryWidth = width.value;
      const boundaryHeight = height.value;
      const imageData = ScanLineFill(
        canvasCtx.value,
        columnIndex,
        rowIndex,
        boundaryWidth,
        boundaryHeight,
        oldColor,
        newColor
      );
      canvasCtx.value.putImageData(imageData, 0, 0);
      // boundaryFill4(
      //   canvasCtx.value,
      //   columnIndex,
      //   rowIndex,
      //   boundaryWidth,
      //   boundaryHeight,
      //   oldColor,
      //   newColor
      // );
    }
  }
  function mouseMove() {
    console.log("bucket mouse move");
  }
  function mouseUp() {
    console.log("bucket mouse up");
  }
  return {
    mouseDown,
    mouseMove,
    mouseUp
  };
}
