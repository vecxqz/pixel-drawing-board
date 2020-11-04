import { computed, ref } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useMove(this: any) {
  const store: any = useStore();
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
  const tempImageData = ref(null);
  function mouseDown(this: any, e: MouseEvent) {
    tempImageData.value = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    // console.log(startX.value, startY.value);
  }
  function mouseMove(this: any, e: MouseEvent) {
    // console.log(endX.value, endY.value);
    // console.log(endX.value - startX.value, endY.value - startY.value);
    const diffX = endX.value - startX.value;
    const diffY = endY.value - startY.value;
    const imageData = tempImageData.value;
    canvasCtx.value.clearRect(0, 0, width.value, height.value);
    canvasCtx.value.putImageData(imageData, diffX, diffY);
  }
  function mouseUp(this: any, e: MouseEvent) {
    // console.log(endX.value - startX.value, endY.value - startY.value);
    const diffX = endX.value - startX.value;
    const diffY = endY.value - startY.value;
    const imageData = tempImageData.value;
    canvasCtx.value.clearRect(0, 0, width.value, height.value);
    canvasCtx.value.putImageData(imageData, diffX, diffY);
    tempImageData.value = null;
    // console.log(endX.value, endY.value);
  }

  return { mouseDown, mouseMove, mouseUp };
}
