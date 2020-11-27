import { useWrapStore } from "../store/index";
import { computed, ref } from "vue";
export function useMousePosition() {
  const store = useWrapStore();
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const width = computed(() => {
    return store.state.canvasModule.width;
  });
  const height = computed(() => {
    return store.state.canvasModule.height;
  });
  const realWidth = computed(() => {
    return width.value / size.value;
  });
  const realHeight = computed(() => {
    return height.value / size.value;
  });
  const startX = computed(
    () => store.state.canvasModule.eventPoint.startPoint.x
  );
  const startY = computed(
    () => store.state.canvasModule.eventPoint.startPoint.y
  );
  const endX = computed(() => store.state.canvasModule.eventPoint.endPoint.x);
  const endY = computed(() => store.state.canvasModule.eventPoint.endPoint.y);

  function mouseDown(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    store.dispatch("canvasModule/SET_START_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
  }

  function mouseMove(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    store.dispatch("canvasModule/SET_END_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
  }

  function mouseUp(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    store.dispatch("canvasModule/SET_END_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
  }

  return {
    mouseDown,
    mouseMove,
    mouseUp,
    startX,
    startY,
    endX,
    endY
  };
}
