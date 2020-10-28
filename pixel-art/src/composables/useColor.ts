import { computed } from "vue";
import { useStore } from "./useStore";
export function useColor(this: any) {
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
  const startX = computed(() =>
    Math.floor(
      store.state.canvasModule.eventPoint.startPoint.e.offsetX / size.value
    )
  );
  const startY = computed(() =>
    Math.floor(
      store.state.canvasModule.eventPoint.startPoint.e.offsetY / size.value
    )
  );
  const endX = computed(() =>
    Math.floor(
      store.state.canvasModule.eventPoint.endPoint.e.offsetX / size.value
    )
  );
  const endY = computed(() =>
    Math.floor(
      store.state.canvasModule.eventPoint.endPoint.e.offsetY / size.value
    )
  );

  function setCurrentColor(this: any, e: MouseEvent) {
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
