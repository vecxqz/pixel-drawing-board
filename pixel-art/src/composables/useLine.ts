import { bresenhamLine, drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
export function useLine(this: any) {
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
  function mouseDown(this: any, e: MouseEvent) {
    console.log("line mouse move");
  }
  function mouseMove(this: any, e: MouseEvent) {
    bresenhamLine(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
      }
    );
  }
  function mouseUp(this: any, e: MouseEvent) {
    bresenhamLine(
      startX.value,
      startY.value,
      endX.value,
      endY.value,
      (columnIndex: number, rowIndex: number) => {
        drawGrid(
          canvasCtx.value,
          currentLayer.value,
          columnIndex,
          rowIndex,
          color.value
        );
        store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
          columnIndex,
          rowIndex,
          data: {
            color: color.value
          }
        });
      }
    );
  }

  return { mouseDown, mouseMove, mouseUp };
}
