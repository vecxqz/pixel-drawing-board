import { drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
import { useCanvas } from "./useCanvas";
export function useColorPicker(this: any) {
  const { calcColor } = useCanvas();
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const width = computed(() => store.state.canvasModule.width);
  const height = computed(() => store.state.canvasModule.height);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex].layer
  );

  function mouseDown(this: any, e: MouseEvent) {
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    console.log(calcColor(imageData, columnIndex, rowIndex));
    const { color } = store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers[store.state.canvasModule.currentLayerIndex].layer[columnIndex][
      rowIndex
    ];
    store.dispatch("canvasModule/SET_COLOR", color);
  }

  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { color } = store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers[store.state.canvasModule.currentLayerIndex].layer[columnIndex][
      rowIndex
    ];
    store.dispatch("canvasModule/SET_COLOR", color);
  }
  function mouseUp(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { color } = store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers[store.state.canvasModule.currentLayerIndex].layer[columnIndex][
      rowIndex
    ];
    store.dispatch("canvasModule/SET_COLOR", color);
  }
  return { mouseDown, mouseMove, mouseUp };
}
