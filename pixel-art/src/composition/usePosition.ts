import { useStore } from "./useStore";
import { computed } from "vue";
export function useMousePosition() {
  const store: any = useStore();
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    store.dispatch("canvasModule/SET_START_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
    console.log("select mouseDown");
  }
  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    this.$store.dispatch("canvasModule/SET_END_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
    console.log("select mouseMove");
  }
  function mouseUp(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    this.$store.dispatch("canvasModule/SET_END_POINT", {
      e,
      x: columnIndex,
      y: rowIndex
    });
    console.log("select mouseUp");
  }
  return {
    mouseDown,
    mouseMove,
    mouseUp
  };
}
