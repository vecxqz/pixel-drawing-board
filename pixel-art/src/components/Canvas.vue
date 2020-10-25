<template>
  <div id="canvas">
    <div
      id="canvas-container"
      class="pos-relative"
      :style="
        `width:${$store.state.canvasModule.width}px;height:$[$store.state.canvasModule.height}px`
      "
    >
      <canvas
        ref="canvas"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none"
        ref="selectcanvas"
        :style="{
          visibility: selectArea.isSet ? 'visible' : 'hide',
          left: selectArea.left,
          top: selectArea.top
        }"
        :width="selectArea.width"
        :height="selectArea.height"
      />
      <div style="color:white">{{ selectArea }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePencil } from "../composition/usePencil";
import { useBucket } from "../composition/useBucket";
import { useLine } from "../composition/useLine";
import { useSquare } from "../composition/useSquare";
import { useColorPicker } from "../composition/useColorPicker";
import { useCircle } from "../composition/useCircle";
import { useEraser } from "../composition/useEraser";
import { useMousePosition } from "../composition/usePosition";
import {
  drawGrid,
  initGrid,
  drawGridGroup,
  drawSelectArea
} from "../util/canvas";
import { isUndefined } from "../util/common";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, debounceTime } from "rxjs/operators";
export default {
  name: "Canvas",
  setup(this: any) {
    const {
      mouseDown: pencilMouseDown,
      mouseMove: pencilMouseMove,
      mouseUp: pencilMouseUp
    } = usePencil();
    const {
      mouseDown: bucketMouseDown,
      mouseMove: bucketMouseMove,
      mouseUp: bucketMouseUp
    } = useBucket();
    const {
      mouseDown: lineMouseDown,
      mouseMove: lineMouseMove,
      mouseUp: lineMouseUp
    } = useLine();
    const {
      mouseDown: squareMouseDown,
      mouseMove: squareMouseMove,
      mouseUp: squareMouseUp
    } = useSquare();
    const {
      mouseDown: colorPickerMouseDown,
      mouseMove: colorPickerMouseMove,
      mouseUp: colorPickerMouseUp
    } = useColorPicker();
    const {
      mouseDown: circleMouseDown,
      mouseMove: circleMouseMove,
      mouseUp: circleMouseUp
    } = useCircle();
    const {
      mouseDown: eraserMouseDown,
      mouseMove: eraserMouseMove,
      mouseUp: eraserMouseUp
    } = useEraser();
    const {
      mouseDown: recordMouseDownPosition,
      mouseMove: recordMouseMovePosition,
      mouseUp: recordMouseUpPosition
    } = useMousePosition();
    return {
      pencilMouseDown,
      pencilMouseMove,
      pencilMouseUp,
      bucketMouseDown,
      bucketMouseMove,
      bucketMouseUp,
      lineMouseDown,
      lineMouseMove,
      lineMouseUp,
      squareMouseDown,
      squareMouseMove,
      squareMouseUp,
      colorPickerMouseDown,
      colorPickerMouseMove,
      colorPickerMouseUp,
      circleMouseDown,
      circleMouseMove,
      circleMouseUp,
      eraserMouseDown,
      eraserMouseMove,
      eraserMouseUp,
      recordMouseDownPosition,
      recordMouseMovePosition,
      recordMouseUpPosition
    };
  },
  data() {
    return {
      imageData: undefined,
      distance: {
        startX: undefined,
        startY: undefined,
        endX: undefined,
        endY: undefined,
        diffX: 0,
        diffY: 0
      }
    };
  },
  computed: {
    selectArea(this: any) {
      const {
        selectArea: { startX, startY, endX, endY, isSet },
        size
      } = this.$store.state.canvasModule;
      const {
        distance: { diffX, diffY }
      } = this;
      let left = 0,
        top = 0,
        width = 0,
        height = 0;
      if (startX >= endX) {
        left = (endX + diffX) * size;
        width = (startX - endX + 1) * size;
      } else {
        left = (startX + diffX) * size;
        width = (endX - startX + 1) * size;
      }
      if (startY >= endY) {
        top = (endY + diffY) * size;
        height = (startY - endY + 1) * size;
      } else {
        top = (startY + diffY) * size;
        height = (endY - startY + 1) * size;
      }
      return {
        isSet: isSet,
        width: width,
        height: height,
        left: `${left + 0}px`,
        top: `${top + 0}px`,
        startX,
        endX,
        diffX,
        startY,
        endY,
        diffY
      };
    },
    tempLayer(this: any) {
      return this.$store.state.canvasModule.tempLayer;
    },
    canvasCtx(this: any) {
      return this.$store.state.canvasModule.canvasCtx;
    },
    currentLayer(this: any) {
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      return this.$store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ];
    }
  },
  mounted(this: any) {
    const { canvas,selectcanvas } = this.$refs;
    const canvasContainer = window.document.getElementById("canvas-container");
    this.$store.dispatch("canvasModule/CREATE_PAGE");
    this.$store.dispatch("canvasModule/CREATE_TEMP_LAYER");
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.$store.dispatch("canvasModule/SET_SELECTCANVASCTX", selectcanvas);
    this.parse();
    const mouseDown = fromEvent(canvasContainer as HTMLElement, "mousedown");
    const mouseMove = fromEvent(canvasContainer as HTMLElement, "mousemove");
    const mouseUp = fromEvent(canvasContainer as HTMLElement, "mouseup");
    mouseDown
      .pipe(
        tap((e: any) => {
          const { mode, size } = this.$store.state.canvasModule,
            columnIndex = Math.floor(e.offsetX / size),
            rowIndex = Math.floor(e.offsetY / size);
          this.recordMouseDownPosition(e);
          if (mode === "pencil") {
            this.pencilMouseDown(e);
          }
          if (mode === "line") {
            this.lineMouseDown(e);
          }
          if (mode === "bucket") {
            this.bucketMouseDown(e);
          }
          if (mode === "square") {
            this.squareMouseDown(e);
          }
          if (mode === "colorPicker") {
            this.colorPickerMouseDown(e);
          }
          if (mode === "circle") {
            this.circleMouseDown(e);
          }
          if (mode === "eraser") {
            this.eraserMouseDown(e);
          }
          if (mode === "select") {
            this.distance.startX = Math.floor(e.offsetX / size);
            this.distance.startY = Math.floor(e.offsetY / size);
            const {
              selectArea: { startX, startY, endX, endY, isSet }
            } = this.$store.state.canvasModule;
            if (
              columnIndex >= startX &&
              columnIndex <= endX &&
              rowIndex >= startY &&
              rowIndex <= endY
            ) {
              this.distance.endX = Math.floor(e.offsetX / size);
              this.distance.endY = Math.floor(e.offsetY / size);
              this.$store.dispatch(
                "canvasModule/SET_SELECT_AREA_SET_STATUS",
                true
              );
              this.$store.dispatch(
                "canvasModule/SET_SELECT_AREA_MOVE_STATUS",
                true
              );
            } else {
              if (isSet) {
                this.$store.dispatch(
                  "canvasModule/SET_SELECT_AREA_CLICK_OUT_STATUS",
                  true
                );
              }
            }
          }
        }),
        map(() =>
          mouseMove.pipe(
            takeUntil(
              mouseUp.pipe(
                tap((e: any) => {
                  this.$store.dispatch("canvasModule/SET_END_POINT", { e });
                  const {
                      mode,
                      size,
                      eventPoint: { startPoint, endPoint }
                    } = this.$store.state.canvasModule,
                    columnIndex = Math.floor(e.offsetX / size),
                    rowIndex = Math.floor(e.offsetY / size),
                    x1 = Math.floor(startPoint.e.offsetX / size),
                    y1 = Math.floor(startPoint.e.offsetY / size),
                    x2 = Math.floor(endPoint.e.offsetX / size),
                    y2 = Math.floor(endPoint.e.offsetY / size);
                  this.$store.dispatch(
                    "canvasModule/SET_COLUMN_INDEX",
                    columnIndex
                  );
                  this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
                  if (mode === "pencil") {
                    this.canvasImageDataSaveClean();
                    this.pencilMouseUp(e);
                  }
                  if (mode === "line") {
                    this.canvasImageDataSaveClean();
                    this.lineMouseUp(e);
                  }
                  if (mode === "bucket") {
                    this.canvasImageDataSaveClean();
                    this.bucketMouseUp(e);
                  }
                  if (mode === "square") {
                    this.canvasImageDataSaveClean();
                    this.squareMouseUp(e);
                  }
                  if (mode === "circle") {
                    this.canvasImageDataSaveClean();
                    this.circleMouseUp(e);
                  }
                  if (mode === "bucket") {
                    this.canvasImageDataSaveClean();
                  }
                  if (mode === "colorPicker") {
                    this.colorPickerMouseUp(e);
                  }
                  if (mode === "eraser") {
                    this.eraserMouseUp(e);
                  }
                  if (mode === "select") {
                    this.canvasImageDataSaveClean();
                    const {
                      selectArea: {
                        startX,
                        startY,
                        endX,
                        endY,
                        isSet,
                        isMove,
                        isClickOut,
                        data
                      }
                    } = this.$store.state.canvasModule;
                    if (!isSet) {
                      let selectArea: Array<any> = [];
                      for (let x = 0; x <= endX - startX; x++) {
                        for (let y = 0; y <= endY - startY; y++) {
                          if (!Array.isArray(selectArea[x])) {
                            selectArea[x] = [];
                          }
                          selectArea[x][
                            y
                          ] = this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ][x + startX][y + startY];
                        }
                      }
                      drawSelectArea(
                        this.canvasCtx,
                        this.$refs.selectcanvas.getContext("2d"),
                        this.currentLayer,
                        x1,
                        y1,
                        x2,
                        y2,
                        size
                      );
                      for (let x = 0; x < selectArea.length; x++) {
                        for (let y = 0; y < selectArea[x].length; y++) {
                          const { columnIndex, rowIndex } = selectArea[x][y];
                          this.clearGrid(columnIndex, rowIndex);
                        }
                      }
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_DATA",
                        selectArea
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_SET_STATUS",
                        true
                      );
                    }
                    if (isClickOut) {
                      for (let x = 0; x < data.length; x++) {
                        for (let y = 0; y < data[x].length; y++) {
                          const { color } = data[x][y];
                          if (color) {
                            drawGrid(
                              this.canvasCtx,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              this.selectArea.startX + x,
                              this.selectArea.startY + y,
                              color
                            );
                            this.$store.state.canvasModule.pages[
                              this.$store.state.canvasModule.currentPageIndex
                            ].layers[
                              this.$store.state.canvasModule.currentLayerIndex
                            ][this.selectArea.startX + x][
                              this.selectArea.startY + y
                            ].color = color;
                          }
                        }
                      }
                      this.distance.startX = undefined;
                      this.distance.startY = undefined;
                      this.distance.endX = undefined;
                      this.distance.endY = undefined;
                      this.distance.diffX = 0;
                      this.distance.diffY = 0;
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_SET_STATUS",
                        false
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_START_COORDINATE",
                        {
                          x: 0,
                          y: 0
                        }
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_END_COORDINATE",
                        {
                          x: 0,
                          y: 0
                        }
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_CLICK_OUT_STATUS",
                        false
                      );
                    }

                    if (isMove) {
                      // 拖拽选择区域结束
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_SET_STATUS",
                        true
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_MOVE_STATUS",
                        false
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_START_COORDINATE",
                        {
                          x: startX + this.distance.diffX,
                          y: startY + this.distance.diffY
                        }
                      );
                      this.$store.dispatch(
                        "canvasModule/SET_SELECT_AREA_END_COORDINATE",
                        {
                          x: endX + this.distance.diffX,
                          y: endY + this.distance.diffY
                        }
                      );
                      this.distance.startX = undefined;
                      this.distance.startY = undefined;
                      this.distance.endX = undefined;
                      this.distance.endY = undefined;
                      this.distance.diffX = 0;
                      this.distance.diffY = 0;
                    }
                  }
                })
              )
            )
          )
        ),
        debounceTime(16, animationFrameScheduler),
        concatAll()
      )
      .subscribe(e => {
        this.handleMouseMove(e);
      });
  },
  methods: {
    clearGrid(this: any, x: number, y: number) {
      const { backgroundColor } = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y];
      drawGrid(
        this.canvasCtx,
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex],
        x,
        y,
        backgroundColor
      );
      this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y] = {
        ...this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y],
        color: undefined
      };
    },
    handleMouseMove(this: any, e: any) {
      const columnIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        rowIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      this.recordMouseMovePosition(e);
      this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      const {
        canvasCtx,
        mode,
        size,
        eventPoint: { startPoint, endPoint }
      } = this.$store.state.canvasModule;
      const x1 = Math.floor(startPoint.e.offsetX / size),
        y1 = Math.floor(startPoint.e.offsetY / size),
        x2 = Math.floor(endPoint.e.offsetX / size),
        y2 = Math.floor(endPoint.e.offsetY / size);
      if (mode === "pencil") {
        this.pencilMouseMove(e);
      }
      if (mode === "line") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.lineMouseMove(e);
      }
      if (mode === "eraser") {
        this.eraserMouseMove(e);
      }
      if (mode === "bucket") {
        this.bucketMouseMove(e);
      }
      if (mode === "square") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.squareMouseMove(e);
      }
      if (mode === "colorPicker") {
        this.colorPickerMouseMove(e);
      }
      if (mode === "circle") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.circleMouseMove(e);
      }
      if (mode === "select") {
        const {
          selectArea: { isSet, isMove }
        } = this.$store.state.canvasModule;
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        if (!isSet) {
          // 透明度设置
          canvasCtx.globalAlpha = 0.3;
          drawGridGroup(canvasCtx, this.tempLayer, x1, y1, x2, y2, "black");
          canvasCtx.globalAlpha = 1;
          this.$store.dispatch(
            "canvasModule/SET_SELECT_AREA_START_COORDINATE",
            {
              x: x1,
              y: y1
            }
          );
          this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
            x: x2,
            y: y2
          });
        }
        if (isMove) {
          this.distance.endX = Math.floor(e.offsetX / size);
          this.distance.endY = Math.floor(e.offsetY / size);
          this.distance.diffX = this.distance.endX - this.distance.startX;
          this.distance.diffY = this.distance.endY - this.distance.startY;
        }
      }
    },
    parse(this: any) {
      const layer = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex];
      for (let i = 0; i < layer.length; i++)
        for (let j = 0; j < layer.length; j++) {
          const cell = layer[i][j];
          const { color, backgroundColor } = cell;
          initGrid(
            this.canvasCtx,
            layer,
            i,
            j,
            color ? color : backgroundColor
          );
        }
      (window as any).layer = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex].map((x: any) =>
        x.map((y: any) => ({ ...y }))
      );
    },
    canvasImageDataSave(this: any) {
      const { canvasCtx } = this;
      // 存储在进行绘制之前的画布数据
      if (isUndefined(this.imageData)) {
        this.imageData = canvasCtx.getImageData(
          0,
          0,
          this.$store.state.canvasModule.width,
          this.$store.state.canvasModule.height
        );
      }
    },
    canvasImageDataUse(this: any) {
      const { canvasCtx } = this;
      if (!isUndefined(this.imageData)) {
        canvasCtx.putImageData(this.imageData, 0, 0);
      }
    },
    canvasImageDataSaveClean(this: any) {
      this.imageData = undefined;
    }
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #141518;
}
.pe-none {
  pointer-events: none;
}
.pos-absoulte {
  position: absolute;
}
.pos-relative {
  position: relative;
}
</style>
