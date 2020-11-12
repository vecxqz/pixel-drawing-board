import { ScanLineFill, boundaryFill4 } from "../utils/fill";
import { computed } from "vue";
import { useCanvas } from "./useCanvas";
import { useStore } from "./useStore";
import Color from "color";

export function useBucket() {
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
  function mouseDown(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    // const oldColor = currentLayer.value[columnIndex][rowIndex].color,
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const [r, g, b] = Color(color.value).color;
    const oldColor = calcColor(imageData, columnIndex, rowIndex).rgba,
      newColor = `rgba(${r}, ${g}, ${b}, 1)`;
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
