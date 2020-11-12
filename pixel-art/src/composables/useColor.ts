import { computed } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useColor() {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  const { startX, startY, endX, endY } = useMousePosition();

  function setCurrentColor(e: MouseEvent) {
    const { primaryColor, secondaryColor } = store.state.canvasModule;
    let color = primaryColor;
    if (e.button === 0) {
      color = primaryColor;
    }
    if (e.button === 2) {
      color = secondaryColor;
    }
    store.dispatch("canvasModule/SET_COLOR", color);
  }

  return { setCurrentColor };
}
