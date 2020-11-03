import { useStore } from "./useStore";
import { computed } from "vue";
export function useMousePosition() {
  const store: any = useStore();
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
  const startX = computed(() => {
    let num = Math.floor(
      store.state.canvasModule.eventPoint.startPoint.e.offsetX / size.value
    );
    if (num >= realWidth.value) {
      num = realWidth.value - 1;
    }
    if (num < 0) {
      num = 0;
    }
    return num;
  });
  const startY = computed(() => {
    let num = Math.floor(
      store.state.canvasModule.eventPoint.startPoint.e.offsetY / size.value
    );
    if (num >= realHeight.value) {
      num = realHeight.value - 1;
    }
    if (num < 0) {
      num = 0;
    }
    return num;
  });
  const endX = computed(() => {
    let num = Math.floor(
      store.state.canvasModule.eventPoint.endPoint.e.offsetX / size.value
    );
    if (num >= realWidth.value) {
      num = realWidth.value - 1;
    }
    if (num < 0) {
      num = 0;
    }
    return num;
  });
  const endY = computed(() => {
    let num = Math.floor(
      store.state.canvasModule.eventPoint.endPoint.e.offsetY / size.value
    );
    if (num >= realHeight.value) {
      num = realHeight.value - 1;
    }
    if (num < 0) {
      num = 0;
    }
    return num;
  });
  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    store.dispatch("canvasModule/SET_START_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
  }
  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    this.$store.dispatch("canvasModule/SET_END_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
  }
  function mouseUp(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    this.$store.dispatch("canvasModule/SET_END_POINT", {
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
