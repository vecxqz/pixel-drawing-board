import { bresenhamLineCircle, drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
export function useCircle(this: any) {
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
    console.log("circle mouseDown");
  }
  // 拖拽时绘制圆形
  function mouseMove(this: any, e: MouseEvent) {
    // 防止圆贴着圆心形成的直角坐标系的边飘逸
    let midX1, midY1, r1, ya1;
    // 一三象限
    midX1 = Math.floor((endX.value + startX.value) / 2);
    if (
      (endX.value < startX.value && endY.value < startY.value) ||
      (endX.value > startX.value && endY.value > startY.value)
    ) {
      const k = 1;
      ya1 = (endX.value - startX.value) * k + startY.value;
      midY1 = Math.floor((startY.value + ya1) / 2);
      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
      r1 = Math.abs(Math.floor((ya1 - startY.value) / 2));
    } else {
      const k = -1;
      ya1 = (endX.value - startX.value) * k + startY.value;
      midY1 = Math.floor((startY.value + ya1) / 2);
      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
      r1 = Math.abs(Math.floor((ya1 - startY.value) / 2));
    }
    bresenhamLineCircle(
      currentLayer.value,
      midX1,
      midY1,
      r1,
      false,
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
  // 鼠标松开时，把矩形绘制，并修改数据
  function mouseUp(this: any, e: MouseEvent) {
    // 防止圆贴着圆心形成的直角坐标系的边飘逸
    let midX1, midY1, r1, ya1;
    midX1 = Math.floor((endX.value + startX.value) / 2);
    if (
      (endX.value < startX.value && endY.value < startY.value) ||
      (endX.value > startX.value && endY.value > startY.value)
    ) {
      const k = 1;
      ya1 = (endX.value - startX.value) * k + startY.value;
      midY1 = Math.floor((startY.value + ya1) / 2);
      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
      r1 = Math.abs(Math.floor((ya1 - startY.value) / 2));
    } else {
      const k = -1;
      ya1 = (endX.value - startX.value) * k + startY.value;
      midY1 = Math.floor((startY.value + ya1) / 2);
      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
      r1 = Math.abs(Math.floor((ya1 - startY.value) / 2));
    }
    bresenhamLineCircle(
      currentLayer.value,
      midX1,
      midY1,
      r1,
      false,
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
