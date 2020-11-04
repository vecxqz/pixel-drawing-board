import { drawGridB, clearGridB } from "../util/canvas";
import { computed, reactive, nextTick, toRaw, ref } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useSelect(this: any) {
  const { startX, startY, endX, endY } = useMousePosition();
  const isSet = ref(false);
  const isMove = ref(false);
  const isClickOutSide = ref(true);
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const selectCanvasCtx = computed(
    () => store.state.canvasModule.selectCanvasCtx
  );
  const width = computed(() => store.state.canvasModule.width);
  const height = computed(() => store.state.canvasModule.height);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const selectImageData = ref(null);
  const tempImageData = ref(null);
  const selectArea = reactive({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    diffX: 0,
    diffY: 0
  });

  function setSetStatus(status: boolean) {
    isSet.value = status;
  }
  function setMoveStatus(status: boolean) {
    isMove.value = status;
  }
  function setClickOutSideStatus(status: boolean) {
    isClickOutSide.value = status;
  }

  function isInSelectArea(
    x: number,
    y: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Boolean {
    const minX = Math.min(startX, endX);
    const minY = Math.min(startY, endY);
    const maxX = Math.max(startX, endX);
    const maxY = Math.max(startY, endY);
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true;
    }
    return false;
  }
  function setSelectArea({
    startX,
    startY,
    endX,
    endY
  }: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) {
    selectArea.startX = Math.min(startX, endX);
    selectArea.startY = Math.min(startY, endY);
    selectArea.endX = Math.max(startX, endX);
    selectArea.endY = Math.max(startY, endY);
    selectArea.diffX = selectArea.endX - selectArea.startX;
    selectArea.diffY = selectArea.endY - selectArea.startY;
    if (selectArea.diffX !== 0) selectArea.diffX += 1;
    if (selectArea.diffY !== 0) selectArea.diffY += 1;
  }

  function mouseDown(this: any, e: MouseEvent) {
    // 没设置选取区域前存储画布像素信息
    if (!isSet.value) {
      tempImageData.value = canvasCtx.value.getImageData(
        0,
        0,
        width.value,
        height.value
      );
    }
    // 如果设置了选择区域则判断是否点击在选择区域内
    if (isSet.value) {
      const isInSelectAreaFlag = isInSelectArea(
        startX.value,
        startY.value,
        selectArea.startX,
        selectArea.startY,
        selectArea.endX,
        selectArea.endY
      );
      console.log(isInSelectAreaFlag);
      console.log(
        selectArea.startX,
        selectArea.startY,
        selectArea.endX,
        selectArea.endY
      );
      if (isInSelectAreaFlag) {
        setSetStatus(true);
        setClickOutSideStatus(false);
        setMoveStatus(true);
        // 说明在点击区域内,进入移动
      } else {
        // 不在点击区域内，取消选择区域
        console.log("释放");
        const maxX = selectArea.startX;
        const maxY = selectArea.startY;
        canvasCtx.value.putImageData(selectImageData.value, maxX, maxY);
        setClickOutSideStatus(true);
        setSetStatus(false);
        setMoveStatus(false);
        tempImageData.value = canvasCtx.value.getImageData(
          0,
          0,
          width.value,
          height.value
        );
        selectImageData.value = null;
        setSelectArea({
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0
        });
      }
    }
  }
  function mouseMove(this: any, e: MouseEvent) {
    // 点击外部区域或是没有绘制才记录
    if (isClickOutSide.value) {
      setSelectArea({
        startX: startX.value,
        startY: startY.value,
        endX: endX.value,
        endY: endY.value
      });
    }
    // 设置起始坐标
    // console.log(startX.value, startY.value, diffX, diffY);
    const {
      startX: selectAreaStartX,
      startY: selectAreaStartY,
      diffX: selectAreaDiffX,
      diffY: selectAreaDiffY
    } = selectArea;
    if (!isSet.value && selectAreaDiffX !== 0 && selectAreaDiffY !== 0) {
      // console.log(
      //   selectAreaStartX,
      //   selectAreaStartY,
      //   selectAreaDiffX,
      //   selectAreaDiffY
      // );
      const tempColor = color.value;
      canvasCtx.value.globalAlpha = 0.5;
      canvasCtx.value.fillStyle = "rgb(0,0,0)";
      canvasCtx.value.fillRect(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      canvasCtx.value.globalAlpha = 1;
      canvasCtx.value.fillStyle = tempColor;
    }
    // 移动状态
    if (isMove.value) {
      const diffX = endX.value - startX.value;
      const diffY = endY.value - startY.value;
      // console.log(diffX, diffY);
      // console.log(startX.value, startY.value);
      const tempColor = color.value;
      // 清除选择区域
      const belowImageData = canvasCtx.value.getImageData(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      canvasCtx.value.clearRect(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 绘制选择区域
      canvasCtx.value.putImageData(
        belowImageData,
        selectAreaStartX + diffX,
        selectAreaStartY + diffY
      );
      canvasCtx.value.putImageData(
        selectImageData.value,
        selectAreaStartX + diffX,
        selectAreaStartY + diffY
      );
      canvasCtx.value.globalAlpha = 0.5;
      canvasCtx.value.fillStyle = "rgb(0,0,0)";
      // 绘制阴影区域
      canvasCtx.value.fillRect(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      canvasCtx.value.globalAlpha = 1;
      canvasCtx.value.fillStyle = tempColor;
    }
  }
  function mouseUp(this: any, e: MouseEvent) {
    const tempFillStyle = canvasCtx.value.fillStyle;
    // 点击外部区域或是没有绘制才记录
    if (isClickOutSide.value) {
      setSelectArea({
        startX: startX.value,
        startY: startY.value,
        endX: endX.value,
        endY: endY.value
      });
    }
    const {
      startX: selectAreaStartX,
      startY: selectAreaStartY,
      endX: selectAreaEndX,
      endY: selectAreaEndY,
      diffX: selectAreaDiffX,
      diffY: selectAreaDiffY
    } = selectArea;
    // 设置区域颜色
    if (!isSet.value && selectAreaDiffX !== 0 && selectAreaDiffY !== 0) {
      // 先获取选择区域像素信息再绘制阴影
      canvasCtx.value.putImageData(tempImageData.value, 0, 0);
      selectImageData.value = canvasCtx.value.getImageData(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      canvasCtx.value.putImageData(tempImageData.value, 0, 0);
      canvasCtx.value.globalAlpha = 0.5;
      canvasCtx.value.fillStyle = "rgb(0,0,0)";
      canvasCtx.value.fillRect(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 重置
      canvasCtx.value.globalAlpha = 1;
      canvasCtx.value.fillStyle = tempFillStyle;
      setSetStatus(true);
    }
    // 移动状态
    if (isMove.value) {
      const diffX = endX.value - startX.value;
      const diffY = endY.value - startY.value;
      // console.log(diffX, diffY);
      // console.log(startX.value, startY.value);
      const tempColor = color.value;
      // 清除选择区域
      canvasCtx.value.clearRect(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 绘制选择区域
      canvasCtx.value.putImageData(
        selectImageData.value,
        selectAreaStartX + diffX,
        selectAreaStartY + diffY
      );
      canvasCtx.value.globalAlpha = 0.5;
      canvasCtx.value.fillStyle = "rgb(0,0,0)";
      // 绘制阴影区域
      canvasCtx.value.fillRect(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      canvasCtx.value.globalAlpha = 1;
      canvasCtx.value.fillStyle = tempFillStyle;
      setSelectArea({
        startX: selectAreaStartX + diffX,
        startY: selectAreaStartY + diffY,
        endX: selectAreaEndX + diffX,
        endY: selectAreaEndY + diffY
      });
    }
  }

  return { mouseDown, mouseMove, mouseUp, selectArea };
}
