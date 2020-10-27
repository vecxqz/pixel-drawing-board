import { drawSelectArea, drawGrid, drawGridGroup } from "../util/canvas";
import { computed, reactive, nextTick, toRaw } from "vue";
import { layer } from "types/canvas";
import { useStore } from "./useStore";
export function useSelect(this: any) {
  const distance = reactive({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    diffX: 0,
    diffY: 0,
    move: {
      // 存储移动时产生的数据
      startX: 0, // 开始移动时鼠标x坐标
      startY: 0, // 开始移动时鼠标y轴坐标
      endX: 0, // 移动过程中以以及移动结束时鼠标y轴坐标
      endY: 0, // 移动过程中以以及移动结束时鼠标y轴坐标
      moveFlag: true // 标志
    }
  });
  const selectArea: {
    isSet: boolean;
    isMove: boolean;
    isClickOutSide: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    data: Array<any>;
  } = reactive({
    isSet: false,
    isMove: false,
    isClickOutSide: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    data: []
  });
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const selectCanvasCtx = computed(
    () => store.state.canvasModule.selectCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex]
  );
  const startX = computed(() => Math.floor(selectArea.startX));
  const startY = computed(() => Math.floor(selectArea.startY));
  const endX = computed(() => Math.floor(selectArea.endX));
  const endY = computed(() => Math.floor(selectArea.endY));

  function setCoordinateStart({ x, y }: { x: number; y: number }) {
    selectArea.startX = x;
    selectArea.startY = y;
  }
  function setCoordinateEnd({ x, y }: { x: number; y: number }) {
    selectArea.endX = x;
    selectArea.endY = y;
  }
  function setSetStatus(status: boolean) {
    selectArea.isSet = status;
  }
  function setMoveStatus(status: boolean) {
    selectArea.isMove = status;
  }
  function setClickOutSideStatus(status: boolean) {
    selectArea.isClickOutSide = status;
  }

  function setSelectAreaData({
    currentLayer,
    startX,
    startY,
    endX,
    endY
  }: {
    currentLayer: layer;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) {
    const minX = Math.min(startX, endX);
    const minY = Math.min(startY, endY);
    const maxX = Math.max(startX, endX);
    const maxY = Math.max(startY, endY);
    let data: Array<any> = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const dataIndexX = x - minX;
        const dataIndexY = y - minY;
        if (!Array.isArray(data[dataIndexX])) {
          data[dataIndexX] = [];
        }
        data[dataIndexX][dataIndexY] = { ...currentLayer[x][y] };
      }
    }
    selectArea.data = data;
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

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const {
      data,
      isSet,
      isMove,
      isClickOutSide
    }: {
      data: Array<any>;
      isSet: boolean;
      isMove: boolean;
      isClickOutSide: boolean;
    } = selectArea;
    // console.log("开始绘制");
    // console.log(`
    // down
    //   isSet:${isSet},
    //   isMove:${isMove},
    //   isClickOutSide:${isClickOutSide}
    // `);
    // 没有创建选择区域，则创建选择区域
    if (isSet) {
      // 说明点击的是选择区域内部，
      if (
        isInSelectArea(
          columnIndex,
          rowIndex,
          startX.value,
          startY.value,
          endX.value,
          endY.value
        )
      ) {
        // console.log("进入拖拽状态");
        // 设置为可拖拽状态
        setMoveStatus(true);
        // 设置拖拽起点
        distance.startX = columnIndex;
        distance.startY = rowIndex;
      } else {
        // console.log("点击的是已创建的区域，外部,再次拖拽绘制新选择区域");
        // 说明点击的是区域外部,取消选择区域
        setClickOutSideStatus(true);
        // data数组了只存了有color属性的格子信息
        const minX = Math.min(startX.value, endX.value);
        const minY = Math.min(startY.value, endY.value);
        for (let x = 0; x < data.length; x++) {
          for (let y = 0; y < data[x].length; y++) {
            const { color } = data[x][y];
            if (color) {
              // console.log(minX + x, minY + y, color);
              drawGrid(
                canvasCtx.value,
                currentLayer.value,
                minX + x,
                minY + y,
                color
              );
              store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
                columnIndex: minX + x,
                rowIndex: minY + y,
                data: {
                  color
                }
              });
            }
          }
        }
        setSetStatus(false);
        setCoordinateStart({
          x: columnIndex,
          y: rowIndex
        });
        setCoordinateEnd({
          x: 0,
          y: 0
        });
        distance.startX = 0;
        distance.startY = 0;
        distance.endX = 0;
        distance.endY = 0;
        distance.diffX = 0;
        distance.diffY = 0;
        distance.move.startX = 0;
        distance.move.startY = 0;
        distance.move.endX = 0;
        distance.move.endY = 0;
        distance.move.startX = 0;
        distance.move.startX = 0;
        distance.move.moveFlag = true;
      }
    } else {
      // console.log("创建新区域，设置起始坐标");
      setClickOutSideStatus(false);
      setCoordinateStart({
        x: columnIndex,
        y: rowIndex
      });
    }
  }
  function mouseMove(this: any, e: MouseEvent) {
    // console.log("select mouseMove");
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { data, isSet, isMove, isClickOutSide } = selectArea;
    // 如果设置了,则是拖拽事件
    // console.log("绘制中");
    // console.log(`
    // move
    //   isSet:${isSet},
    //   isMove:${isMove},
    //   isClickOutSide:${isClickOutSide}
    // `);
    if (isMove) {
      distance.endX = columnIndex;
      distance.endY = rowIndex;
      distance.diffX = distance.endX - distance.startX;
      distance.diffY = distance.endY - distance.startY;
      // 拖拽时重新设置拖拽区域的起点和终点坐标
      if (distance.move.moveFlag) {
        distance.move.startX = startX.value;
        distance.move.startY = startY.value;
        distance.move.endX = endX.value;
        distance.move.endY = endY.value;
        distance.move.moveFlag = false;
      }
      setCoordinateStart({
        x: distance.move.startX + distance.diffX,
        y: distance.move.startY + distance.diffY
      });
      setCoordinateEnd({
        x: distance.move.endX + distance.diffX,
        y: distance.move.endY + distance.diffY
      });
    }
    if (!isSet) {
      // 创建选择区域
      // console.log("绘制中");
      const endX = columnIndex,
        endY = rowIndex;
      drawGridGroup(
        canvasCtx.value,
        currentLayer.value,
        startX.value,
        startY.value,
        endX,
        endY,
        "black"
      );
      // 在这里设置，就可以把mouseUp里的nextTick去掉
      setCoordinateEnd({
        x: endX,
        y: endY
      });
    }
  }
  function mouseUp(this: any, e: MouseEvent) {
    // console.log("select mouseUp");
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { data, isSet, isMove, isClickOutSide } = selectArea;
    // console.log("绘制完成");
    // console.log(`
    // up
    //   isSet:${isSet},
    //   isMove:${isMove},
    //   isClickOutSide:${isClickOutSide}
    //   distance.move.startX + distance.diffX ${distance.move.startX +
    //     distance.diffX}
    //   `);
    if (
      (isMove && distance.move.startX + distance.diffX !== 0) ||
      distance.move.startY + distance.diffY !== 0
    ) {
      // distance.move.startX + distance.diffX === 0
      // distance.move.startY + distance.diffY === 0
      // 说明没有移动过，则也不进入该的逻辑
      setCoordinateStart({
        x: distance.move.startX + distance.diffX,
        y: distance.move.startY + distance.diffY
      });
      setCoordinateEnd({
        x: distance.move.endX + distance.diffX,
        y: distance.move.endY + distance.diffY
      });
      distance.move.moveFlag = true;
      setMoveStatus(false);
    }
    if (!isSet) {
      const { isSet, isMove, isClickOutSide } = selectArea;
      // console.log(isClickOutSide);
      // 绘制完成
      setClickOutSideStatus(false);
      setSetStatus(true);
      setCoordinateEnd({
        x: columnIndex,
        y: rowIndex
      });
      const currentLayerRaw: layer = toRaw(currentLayer.value);
      // 1.宽高采用计算属性，有延迟，会导致绘制的时候没有宽高，所以将该函数放入nextTick
      // 2.这里如果使用了nextTick，下面去除主画布上格子信息的函数执行后才进入该函数，该函数读到的layer会变空所以不使用nextTick了
      // nextTick(() => {
      drawSelectArea(
        canvasCtx.value,
        selectCanvasCtx.value,
        currentLayerRaw,
        startX.value,
        startY.value,
        endX.value,
        endY.value,
        size.value,
        "black"
      );
      // });
      setSetStatus(true);
      setSelectAreaData({
        currentLayer: currentLayer.value,
        startX: startX.value,
        startY: startY.value,
        endX: endX.value,
        endY: endY.value
      });
      const { data }: { data: Array<any> } = selectArea;
      // 暂时清除真实画布上的该选择区域的像素
      const minX = Math.min(startX.value, endX.value);
      const minY = Math.min(startY.value, endY.value);
      for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data[x].length; y++) {
          const { backgroundColor: color } = data[x][y];
          if (color) {
            drawGrid(
              canvasCtx.value,
              currentLayer.value,
              minX + x,
              minY + y,
              color
            );
            // 提升性能
            // store.state.canvasModule.pages[
            //   store.state.canvasModule.currentPageIndex
            // ].layers[store.state.canvasModule.currentLayerIndex][minX + x][
            //   minY + y
            // ] = {
            //   ...store.state.canvasModule.pages[
            //     store.state.canvasModule.currentPageIndex
            //   ].layers[store.state.canvasModule.currentLayerIndex][minX + x][
            //     minY + y
            //   ],
            //   color: undefined
            // };
            currentLayerRaw[minX + x][minY + y].color = undefined;
            // store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
            //   columnIndex: minX + x,
            //   rowIndex: minY + y,
            //   data: {
            //     color: undefined
            //   }
            // });
          }
        }
      }
    }
  }

  return { mouseDown, mouseMove, mouseUp, selectArea };
}
