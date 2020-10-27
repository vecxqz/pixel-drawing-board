import { drawSelectArea, drawGrid, drawGridGroup } from "../util/canvas";
import { computed, reactive, nextTick } from "vue";
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
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      moveFlag: true
    }
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
  const startX = computed(() =>
    Math.floor(store.state.canvasModule.selectArea.startX)
  );
  const startY = computed(() =>
    Math.floor(store.state.canvasModule.selectArea.startY)
  );
  const endX = computed(() =>
    Math.floor(store.state.canvasModule.selectArea.endX)
  );
  const endY = computed(() =>
    Math.floor(store.state.canvasModule.selectArea.endY)
  );

  const selectAreaAttr = computed(() => store.state.canvasModule.selectArea);
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
    const { data, isSet, isMove } = selectAreaAttr.value;
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
        console.log("点击的是已创建的区域，内部");
        // 设置为可拖拽状态
        store.dispatch("canvasModule/SET_SELECT_AREA_MOVE_STATUS", true);
        // 设置拖拽起点
        distance.startX = columnIndex;
        distance.startY = rowIndex;
      } else {
        console.log("点击的是已创建的区域，外部");
        // 说明点击的是区域外部,取消选择区域
        this.$store.dispatch(
          "canvasModule/SET_SELECT_AREA_CLICK_OUT_STATUS",
          true
        );
      }
    } else {
      console.log("创建新区域，设置起始坐标");
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_START_COORDINATE", {
        x: columnIndex,
        y: rowIndex
      });
    }
  }
  function mouseMove(this: any, e: MouseEvent) {
    console.log("select mouseMove");
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { data, isSet, isMove, isClickOut } = selectAreaAttr.value;
    // 如果设置了,则是拖拽事件
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
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_START_COORDINATE", {
        x: distance.move.startX + distance.diffX,
        y: distance.move.startY + distance.diffY
      });
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
        x: distance.move.endX + distance.diffX,
        y: distance.move.endY + distance.diffY
      });
    }
    if (!isSet) {
      // 创建选择区域
      console.log("绘制中");
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
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
        x: endX,
        y: endY
      });
    }
    // if (isClickOut) {
    // }
  }
  function mouseUp(this: any, e: MouseEvent) {
    console.log("select mouseUp");
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    const { data, isSet, isMove, isClickOut } = selectAreaAttr.value;
    if (isMove) {
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_START_COORDINATE", {
        x: distance.move.startX + distance.diffX,
        y: distance.move.startY + distance.diffY
      });
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
        x: distance.move.endX + distance.diffX,
        y: distance.move.endY + distance.diffY
      });
      distance.move.moveFlag = true;
      store.dispatch("canvasModule/SET_SELECT_AREA_MOVE_STATUS", false);
    }
    if (!isSet) {
      // 绘制完成
      store.dispatch("canvasModule/SET_SELECT_AREA_SET_STATUS", true);
      store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
        x: columnIndex,
        y: rowIndex
      });
      // 1.宽高采用计算属性，有延迟，会导致绘制的时候没有宽高，所以将该函数放入nextTick
      // 2.这里如果使用了nextTick，下面去除主画布上格子信息的函数执行后才进入该函数，该函数读到的layer会变空所以不使用nextTick了
      // nextTick(() => {
      drawSelectArea(
        canvasCtx.value,
        selectCanvasCtx.value,
        currentLayer.value,
        startX.value,
        startY.value,
        endX.value,
        endY.value,
        size.value,
        "black"
      );
      // });
      store.dispatch("canvasModule/SET_SELECT_AREA_SET_STATUS", true);
      store.dispatch("canvasModule/SET_SELECT_AREA_DATA", {
        currentLayer: currentLayer.value,
        startX: startX.value,
        startY: startY.value,
        endX: endX.value,
        endY: endY.value
      });
      const { data } = selectAreaAttr.value;
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
            store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
              columnIndex: minX + x,
              rowIndex: minY + y,
              data: {
                color: undefined
              }
            });
          }
        }
      }
    }
    if (isClickOut) {
      // data数组了只存了有color属性的格子信息
      const minX = Math.min(startX.value, endX.value);
      const minY = Math.min(startY.value, endY.value);
      for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data[x].length; y++) {
          const { color } = data[x][y];
          if (color) {
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
      store.dispatch("canvasModule/SET_SELECT_AREA_SET_STATUS", false);
      store.dispatch("canvasModule/SET_SELECT_AREA_CLICK_OUT_STATUS", false);
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_START_COORDINATE", {
        x: 0,
        y: 0
      });
      this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
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
  }

  return { mouseDown, mouseMove, mouseUp };
}
