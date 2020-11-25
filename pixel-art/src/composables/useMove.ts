import { computed, ref } from "vue";
import { useWrapStore } from "../store/index";
import { useMousePosition } from "./usePosition";
export function useMove() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const width = computed(() => store.state.canvasModule.width);
  const height = computed(() => store.state.canvasModule.height);
  const selectCanvasCtx = computed(
    () => store.state.canvasModule.selectCanvasCtx
  );
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const { startX, startY, endX, endY } = useMousePosition();
  const tempImageData = ref(undefined as ImageData | undefined);
  function mouseDown(e: MouseEvent) {
    tempImageData.value = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    // console.log(startX.value, startY.value);
  }

  function mouseMove(e: MouseEvent) {
    // console.log(endX.value, endY.value);
    // console.log(endX.value - startX.value, endY.value - startY.value);
    const diffX = endX.value - startX.value;
    const diffY = endY.value - startY.value;
    const imageData = tempImageData.value;
    canvasCtx.value.clearRect(0, 0, width.value, height.value);
    canvasCtx.value.putImageData(imageData as ImageData, diffX, diffY);
  }
  
  function mouseUp(e: MouseEvent) {
    // console.log(endX.value - startX.value, endY.value - startY.value);
    const diffX = endX.value - startX.value;
    const diffY = endY.value - startY.value;
    const imageData = tempImageData.value;
    canvasCtx.value.clearRect(0, 0, width.value, height.value);
    canvasCtx.value.putImageData(imageData as ImageData, diffX, diffY);
    // console.log(endX.value, endY.value);
  }

  return { mouseDown, mouseMove, mouseUp };
}
