import { drawGridB, clearGridB } from "../utils/canvas";
import { computed, reactive, nextTick, toRaw, ref } from "vue";
import { useStore } from "./useStore";
import { useMousePosition } from "./usePosition";
export function useSelect() {
  const { startX, startY, endX, endY } = useMousePosition();
  const isSet = ref(false);
  const isMove = ref(false);
  const isClickOutSide = ref(true);
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const selectCanvasCtx = computed(
    () => store.state.canvasModule.selectCanvasCtx
  );
  const tempCanvasCtx = computed(() => store.state.canvasModule.tempCanvasCtx);
  const width = computed(() => store.state.canvasModule.width);
  const height = computed(() => store.state.canvasModule.height);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const moveFinishImageData = ref(null); // 每次移动时没有阴影选择区的imagedata
  const selectImageData = ref(null); //选择区域数据
  const tempImageData = ref(null);
  const selectClearImageData = ref(null); //没有被选取区域的大画布数据
  const firstClear = ref(false);
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

  function mouseDown(e: MouseEvent) {
    // 没设置选取区域前存储画布像素信息
    if (!isSet.value) {
      tempImageData.value = canvasCtx.value.getImageData(
        0,
        0,
        width.value,
        height.value
      );
      // 存储未产生阴影前的画布数据
      moveFinishImageData.value = canvasCtx.value.getImageData(
        0,
        0,
        width.value,
        height.value
      );
    }
    tempCanvasCtx.value.putImageData(tempImageData.value, 0, 0);
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
      if (isInSelectAreaFlag) {
        setSetStatus(true);
        setClickOutSideStatus(false);
        setMoveStatus(true);
        // 初次移动，时清除当前画布上选择区域数据
        tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
        tempCanvasCtx.value.putImageData(selectClearImageData.value, 0, 0);
        const clearImageData = tempCanvasCtx.value.getImageData(
          selectArea.startX,
          selectArea.startY,
          selectArea.diffX,
          selectArea.diffY
        );
        // 清除选择阴影
        canvasCtx.value.clearRect(
          selectArea.startX,
          selectArea.startY,
          selectArea.diffX,
          selectArea.diffY
        );
        // 绘制被选择阴影清除时,同时被清除的原区域数据
        selectCanvasCtx.value.clearRect(
          0,
          0,
          selectArea.diffX,
          selectArea.diffY
        );
        selectCanvasCtx.value.putImageData(clearImageData, 0, 0);
        canvasCtx.value.drawImage(
          selectCanvasCtx.value.canvas,
          selectArea.startX,
          selectArea.startY
        );
        // 说明在点击区域内,进入移动
      } else {
        // 不在点击区域内，取消选择区域
        console.log("释放");
        cancelSelect();
      }
    }
    return isSet.value ? moveFinishImageData.value : undefined;
  }
  function mouseMove(e: MouseEvent) {
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
      const tempColor = color.value;
      tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
      tempCanvasCtx.value.putImageData(selectClearImageData.value, 0, 0);
      const clearImageData = tempCanvasCtx.value.getImageData(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 清除选择阴影
      canvasCtx.value.clearRect(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );

      // 绘制被选择阴影清除时,同时被清除的原区域数据
      selectCanvasCtx.value.clearRect(0, 0, selectAreaDiffX, selectAreaDiffY);
      selectCanvasCtx.value.putImageData(clearImageData, 0, 0);
      canvasCtx.value.drawImage(
        selectCanvasCtx.value.canvas,
        selectAreaStartX + diffX,
        selectAreaStartY + diffY
      );
      // 绘制被选择区域
      selectCanvasCtx.value.clearRect(0, 0, selectAreaDiffX, selectAreaDiffY);
      selectCanvasCtx.value.putImageData(selectImageData.value, 0, 0);
      canvasCtx.value.drawImage(
        selectCanvasCtx.value.canvas,
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
  function mouseUp(e: MouseEvent) {
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
      // 存储被选中区域的imagedata
      selectImageData.value = canvasCtx.value.getImageData(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 存储没有被选择区域的画布数据
      tempCanvasCtx.value.putImageData(tempImageData.value, 0, 0);
      tempCanvasCtx.value.clearRect(
        selectAreaStartX,
        selectAreaStartY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      selectClearImageData.value = tempCanvasCtx.value.getImageData(
        0,
        0,
        width.value,
        height.value
      );
      // 开始 绘制阴影
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
      // 结束 绘制阴影
      setSetStatus(true);
    }
    // 移动状态
    if (isMove.value) {
      const diffX = endX.value - startX.value;
      const diffY = endY.value - startY.value;
      // console.log(diffX, diffY);
      // console.log(startX.value, startY.value);
      // 更新移动区域数据
      setSelectArea({
        startX: selectAreaStartX + diffX,
        startY: selectAreaStartY + diffY,
        endX: selectAreaEndX + diffX,
        endY: selectAreaEndY + diffY
      });
      const tempColor = color.value;
      tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
      tempCanvasCtx.value.putImageData(selectClearImageData.value, 0, 0);
      const clearImageData = tempCanvasCtx.value.getImageData(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );
      // 清除选择阴影
      canvasCtx.value.clearRect(
        selectAreaStartX + diffX,
        selectAreaStartY + diffY,
        selectAreaDiffX,
        selectAreaDiffY
      );

      // 绘制被选择阴影清除时,同时被清除的原区域数据
      selectCanvasCtx.value.clearRect(0, 0, selectAreaDiffX, selectAreaDiffY);
      selectCanvasCtx.value.putImageData(clearImageData, 0, 0);
      canvasCtx.value.drawImage(
        selectCanvasCtx.value.canvas,
        selectAreaStartX + diffX,
        selectAreaStartY + diffY
      );
      // 绘制被选择区域
      selectCanvasCtx.value.clearRect(0, 0, selectAreaDiffX, selectAreaDiffY);
      selectCanvasCtx.value.putImageData(selectImageData.value, 0, 0);
      canvasCtx.value.drawImage(
        selectCanvasCtx.value.canvas,
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

  function cancelSelect() {
    const maxX = selectArea.startX;
    const maxY = selectArea.startY;
    // 获取被选择区域合并的画布上的数据
    tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
    tempCanvasCtx.value.putImageData(selectClearImageData.value, 0, 0);
    const clearImageData = tempCanvasCtx.value.getImageData(
      selectArea.startX,
      selectArea.startY,
      selectArea.diffX,
      selectArea.diffY
    );
    // 清除选择阴影
    canvasCtx.value.clearRect(
      selectArea.startX,
      selectArea.startY,
      selectArea.diffX,
      selectArea.diffY
    );

    // 绘制被选择阴影清除时同时被清除的原区域数据
    selectCanvasCtx.value.clearRect(0, 0, selectArea.diffX, selectArea.diffY);
    selectCanvasCtx.value.putImageData(clearImageData, 0, 0);
    canvasCtx.value.drawImage(
      selectCanvasCtx.value.canvas,
      selectArea.startX,
      selectArea.startY
    );
    // 绘制被选择区域
    selectCanvasCtx.value.clearRect(0, 0, selectArea.diffX, selectArea.diffY);
    selectCanvasCtx.value.putImageData(selectImageData.value, 0, 0);
    canvasCtx.value.drawImage(
      selectCanvasCtx.value.canvas,
      selectArea.startX,
      selectArea.startY
    );
    // 结束 状态重置
    setClickOutSideStatus(true);
    setSetStatus(false);
    setMoveStatus(false);
    tempImageData.value = canvasCtx.value.getImageData(
      0,
      0,
      width.value,
      height.value
    );
    selectClearImageData.value = null;
    selectImageData.value = null;
    setSelectArea({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    });
  }

  return { mouseDown, mouseMove, mouseUp, selectArea, cancelSelect };
}
