import { drawGrid } from "../utils/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
import { useCanvas } from "./useCanvas";
export function useColorPicker() {
  const { calcColor } = useCanvas();
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const width = computed(() => store.state.canvasModule.width);
  const height = computed(() => store.state.canvasModule.height);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  function mouseDown(e: MouseEvent) {
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { rgb: color } = calcColor(imageData, columnIndex, rowIndex);
    console.log(color);
    store.state.canvasModule.primaryColor = color;
    // store.dispatch("canvasModule/SET_COLOR", color);
  }

  function mouseMove(e: MouseEvent) {
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { rgb: color } = calcColor(imageData, columnIndex, rowIndex);
    store.state.canvasModule.primaryColor = color;
    // store.dispatch("canvasModule/SET_COLOR", color);
  }
  function mouseUp(e: MouseEvent) {
    const imageData = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { rgb: color } = calcColor(imageData, columnIndex, rowIndex);
    store.state.canvasModule.primaryColor = color;
    // store.dispatch("canvasModule/SET_COLOR", color);
  }
  return { mouseDown, mouseMove, mouseUp };
}
