import { bresenhamLineCircle, drawGridB } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useCircle(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  const { startX, startY, endX, endY } = useMousePosition();

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
      midX1,
      midY1,
      r1,
      false,
      (columnIndex: number, rowIndex: number) => {
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
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
      midX1,
      midY1,
      r1,
      false,
      (columnIndex: number, rowIndex: number) => {
        drawGridB(canvasCtx.value, {
          columnIndex,
          rowIndex,
          color: color.value,
          size: 1
        });
      }
    );
  }

  return { mouseDown, mouseMove, mouseUp };
}
