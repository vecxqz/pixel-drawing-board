import { ScanLineFill } from "../util/fill";
import { computed, toRaw } from "vue";
import { useStore } from "./useStore";
import { useCanvas } from "./useCanvas";

export function useBucket(this: any) {
  const { calcColor } = useCanvas();
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
  const width = computed(() => {
    return store.state.canvasModule.width;
  });
  const height = computed(() => {
    return store.state.canvasModule.height;
  });
  function mouseDown(this: any, e: MouseEvent) {
    const currentLayerIndexRaw = toRaw(
      store.state.canvasModule.currentLayerIndex
    );
    const currentPageIndexRaw = toRaw(
      store.state.canvasModule.currentPageIndex
    );
    const currentPaesRaw = toRaw(store.state.canvasModule.pages);
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const oldColor = calcColor(imageData, columnIndex, rowIndex).rgb,
      newColor = color.value;
    const layer = JSON.parse(
      JSON.stringify(
        currentPaesRaw[currentPageIndexRaw].layers[currentLayerIndexRaw].layer
      )
    );
    // 传入的是原始对象,提高算法性能
    console.log(oldColor, newColor);
    if (oldColor !== newColor) {
      const boundaryWidth = (width.value / size.value) * 10;
      const boundaryHeight = (height.value / size.value) * 10;
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[store.state.canvasModule.currentLayerIndex].layer = ScanLineFill(
        canvasCtx.value,
        layer,
        columnIndex,
        rowIndex,
        boundaryWidth,
        boundaryHeight,
        oldColor,
        newColor
      );
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
