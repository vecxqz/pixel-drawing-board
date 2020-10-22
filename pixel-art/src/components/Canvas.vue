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
          display: selectArea.isSet ? 'block' : 'none',
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
import {
  bresenhamLine,
  bresenhamLineCircle,
  drawGrid,
  initGrid,
  drawGridGroup,
  drawSelectArea
} from "../util/canvas";
import { ScanLineFill as boundaryFill4 } from "../util/fill";
import { isUndefined } from "../util/common";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, debounceTime } from "rxjs/operators";
export default {
  name: "Canvas",
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
      const left = (startX + diffX) * size;
      const top = (startY + diffY) * size;
      return {
        isSet: isSet,
        width: (endX - startX + 1) * size,
        height: (endY - startY + 1) * size,
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
    const { canvas } = this.$refs;
    const canvasContainer = window.document.getElementById("canvas-container");
    this.$store.dispatch("canvasModule/CREATE_PAGE");
    this.$store.dispatch("canvasModule/CREATE_TEMP_LAYER");
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.parse();
    const mouseDown = fromEvent(canvasContainer as HTMLElement, "mousedown");
    const mouseMove = fromEvent(canvasContainer as HTMLElement, "mousemove");
    const mouseUp = fromEvent(canvasContainer as HTMLElement, "mouseup");
    mouseDown
      .pipe(
        tap((e: any) => {
          this.$store.dispatch("canvasModule/SET_START_POINT", { e });
          this.$store.dispatch("canvasModule/SET_LASET_START_POINT", { e });
          this.$store.dispatch("canvasModule/SET_LASET_END_POINT", { e });
          const {
              // canvasCtx,
              mode,
              size
            } = this.$store.state.canvasModule,
            columnIndex = Math.floor(e.offsetX / size),
            rowIndex = Math.floor(e.offsetY / size);
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
                      canvasCtx,
                      color,
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
                    drawGrid(
                      canvasCtx,
                      this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ],
                      columnIndex,
                      rowIndex,
                      color
                    );
                    this.$store.state.canvasModule.pages[
                      this.$store.state.canvasModule.currentPageIndex
                    ].layers[this.$store.state.canvasModule.currentLayerIndex][
                      columnIndex
                    ][rowIndex] = {
                      ...this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ][columnIndex][rowIndex],
                      color
                    };
                  }
                  if (mode === "line") {
                    this.canvasImageDataSaveClean();
                    bresenhamLine(
                      x1,
                      y1,
                      x2,
                      y2,
                      (columnIndex: number, rowIndex: number) => {
                        drawGrid(
                          canvasCtx,
                          this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ],
                          columnIndex,
                          rowIndex,
                          color
                        );
                        this.$store.state.canvasModule.pages[
                          this.$store.state.canvasModule.currentPageIndex
                        ].layers[
                          this.$store.state.canvasModule.currentLayerIndex
                        ][columnIndex][rowIndex] = {
                          ...this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ][columnIndex][rowIndex],
                          color
                        };
                      }
                    );
                  }
                  if (mode === "square") {
                    this.canvasImageDataSaveClean();
                    if (x1 <= x2 || y1 <= y2) {
                      for (let startX = x1; startX <= x2; startX++)
                        for (let startY = y1; startY <= y2; startY++) {
                          if (
                            startX === x1 ||
                            startX === x2 ||
                            startY === y1 ||
                            startY === y2
                          ) {
                            drawGrid(
                              canvasCtx,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              startX,
                              startY,
                              color
                            );
                            this.$store.state.canvasModule.pages[
                              this.$store.state.canvasModule.currentPageIndex
                            ].layers[
                              this.$store.state.canvasModule.currentLayerIndex
                            ][startX][startY] = {
                              ...this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ][startX][startY],
                              color
                            };
                          }
                        }
                    }
                    if (x1 <= x2 || y1 >= y2) {
                      for (let startX = x1; startX <= x2; startX++)
                        for (let startY = y1; startY >= y2; startY--) {
                          if (
                            startX === x1 ||
                            startX === x2 ||
                            startY === y1 ||
                            startY === y2
                          ) {
                            drawGrid(
                              canvasCtx,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              startX,
                              startY,
                              color
                            );
                            this.$store.state.canvasModule.pages[
                              this.$store.state.canvasModule.currentPageIndex
                            ].layers[
                              this.$store.state.canvasModule.currentLayerIndex
                            ][startX][startY] = {
                              ...this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ][startX][startY],
                              color
                            };
                          }
                        }
                    }
                    if (x1 >= x2 || y1 >= y2) {
                      for (let startX = x1; startX >= x2; startX--)
                        for (let startY = y1; startY >= y2; startY--) {
                          if (
                            startX === x1 ||
                            startX === x2 ||
                            startY === y1 ||
                            startY === y2
                          ) {
                            drawGrid(
                              canvasCtx,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              startX,
                              startY,
                              color
                            );
                            this.$store.state.canvasModule.pages[
                              this.$store.state.canvasModule.currentPageIndex
                            ].layers[
                              this.$store.state.canvasModule.currentLayerIndex
                            ][startX][startY] = {
                              ...this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ][startX][startY],
                              color
                            };
                          }
                        }
                    }
                    if (x1 >= x2 || y1 <= y2) {
                      for (let startX = x1; startX >= x2; startX--)
                        for (let startY = y1; startY <= y2; startY++) {
                          if (
                            startX === x1 ||
                            startX === x2 ||
                            startY === y1 ||
                            startY === y2
                          ) {
                            drawGrid(
                              canvasCtx,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              startX,
                              startY,
                              color
                            );
                            this.$store.state.canvasModule.pages[
                              this.$store.state.canvasModule.currentPageIndex
                            ].layers[
                              this.$store.state.canvasModule.currentLayerIndex
                            ][startX][startY] = {
                              ...this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ][startX][startY],
                              color
                            };
                          }
                        }
                    }
                    this.$store.dispatch("canvasModule/SET_LASET_START_POINT", {
                      e,
                      x: undefined,
                      y: undefined
                    });
                    this.$store.dispatch("canvasModule/SET_LASET_END_POINT", {
                      e,
                      x: undefined,
                      y: undefined
                    });
                  }
                  if (mode === "circle") {
                    this.canvasImageDataSaveClean();
                    const x1 = Math.floor(startPoint.e.offsetX / size),
                      x2 = Math.floor(endPoint.e.offsetX / size);
                    // 防止圆贴着圆心形成的直角坐标系的边飘逸
                    let midX1, midY1, r1, ya1;
                    // 一三象限
                    midX1 = Math.floor((x2 + x1) / 2);
                    if ((x2 < x1 && y2 < y1) || (x2 > x1 && y2 > x1)) {
                      const k = 1;
                      ya1 = (x2 - x1) * k + y1;
                      midY1 = Math.floor((y1 + ya1) / 2);
                      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
                      r1 = Math.abs(Math.floor((ya1 - y1) / 2));
                    } else {
                      // 二四象限
                      const k = -1;
                      ya1 = (x2 - x1) * k + y1;
                      midY1 = Math.floor((y1 + ya1) / 2);
                      // r1 = Math.abs(Math.floor((x2 - x1) / 2));
                      r1 = Math.abs(Math.floor((ya1 - y1) / 2));
                    }
                    bresenhamLineCircle(
                      this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ],
                      midX1,
                      midY1,
                      r1,
                      false,
                      (columnIndex: number, rowIndex: number) => {
                        drawGrid(
                          canvasCtx,
                          this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ],
                          columnIndex,
                          rowIndex,
                          color
                        );
                        this.$store.state.canvasModule.pages[
                          this.$store.state.canvasModule.currentPageIndex
                        ].layers[
                          this.$store.state.canvasModule.currentLayerIndex
                        ][columnIndex][rowIndex] = {
                          ...this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ][columnIndex][rowIndex],
                          color
                        };
                      }
                    );
                  }
                  if (mode === "bucket") {
                    this.canvasImageDataSaveClean();
                    // const stack: Array<any> = [];
                    const oldColor = this.$store.state.canvasModule.pages[
                      this.$store.state.canvasModule.currentPageIndex
                    ].layers[this.$store.state.canvasModule.currentLayerIndex][
                      x1
                    ][y1].color;
                    const newColor = color;
                    if (oldColor !== newColor) {
                      const w = this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[this.$store.state.canvasModule.currentLayerIndex]
                        .length;
                      const h = this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ][0].length;
                      // const layer = [...(window as any).layer];
                      const layer = this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ];
                      this.$store.state.canvasModule.pages[
                        this.$store.state.canvasModule.currentPageIndex
                      ].layers[
                        this.$store.state.canvasModule.currentLayerIndex
                      ] = boundaryFill4(
                        canvasCtx,
                        layer,
                        x1,
                        y1,
                        w,
                        h,
                        oldColor,
                        newColor
                      );
                    }
                  }
                  if (mode === "colorPicker") {
                    const { color } = this.$store.state.canvasModule.pages[
                      this.$store.state.canvasModule.currentPageIndex
                    ].layers[this.$store.state.canvasModule.currentLayerIndex][
                      columnIndex
                    ][rowIndex];
                    this.$store.dispatch("canvasModule/SET_COLOR", color);
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
    setGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      this.canvasCtx.fillStyle = gridColor ? gridColor : gridBoardColor;
    },
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
      this.$store.dispatch("canvasModule/SET_END_POINT", { e });
      this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      const {
        canvasCtx,
        color,
        mode,
        size,
        eventPoint: { startPoint, endPoint }
      } = this.$store.state.canvasModule;
      const x1 = Math.floor(startPoint.e.offsetX / size),
        y1 = Math.floor(startPoint.e.offsetY / size),
        x2 = Math.floor(endPoint.e.offsetX / size),
        y2 = Math.floor(endPoint.e.offsetY / size);
      if (mode === "pencil") {
        drawGrid(canvasCtx, this.tempLayer, columnIndex, rowIndex, color);
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex][columnIndex][
          rowIndex
        ] = {
          ...this.$store.state.canvasModule.pages[
            this.$store.state.canvasModule.currentPageIndex
          ].layers[this.$store.state.canvasModule.currentLayerIndex][
            columnIndex
          ][rowIndex],
          color
        };
      }
      if (mode === "line") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        bresenhamLine(
          x1,
          y1,
          x2,
          y2,
          (columnIndex: number, rowIndex: number) => {
            drawGrid(canvasCtx, this.tempLayer, columnIndex, rowIndex, color);
          }
        );
      }
      if (mode === "eraser") {
        this.eraser(e);
      }
      if (mode === "square") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        if (x1 <= x2 || y1 <= y2) {
          for (let startX = x1; startX <= x2; startX++)
            for (let startY = y1; startY <= y2; startY++) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                drawGrid(canvasCtx, this.tempLayer, startX, startY, color);
              }
            }
        }
        if (x1 <= x2 || y1 >= y2) {
          for (let startX = x1; startX <= x2; startX++)
            for (let startY = y1; startY >= y2; startY--) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                drawGrid(canvasCtx, this.tempLayer, startX, startY, color);
              }
            }
        }
        if (x1 >= x2 || y1 >= y2) {
          for (let startX = x1; startX >= x2; startX--)
            for (let startY = y1; startY >= y2; startY--) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                drawGrid(canvasCtx, this.tempLayer, startX, startY, color);
              }
            }
        }
        if (x1 >= x2 || y1 <= y2) {
          for (let startX = x1; startX >= x2; startX--)
            for (let startY = y1; startY <= y2; startY++) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                drawGrid(canvasCtx, this.tempLayer, startX, startY, color);
              }
            }
        }
      }
      if (mode === "circle") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        // 防止圆贴着圆心形成的直角坐标系的边飘逸
        let midX1, midY1, r1, ya1;
        // 一三象限
        midX1 = Math.floor((x2 + x1) / 2);
        if ((x2 < x1 && y2 < y1) || (x2 > x1 && y2 > x1)) {
          const k = 1;
          ya1 = (x2 - x1) * k + y1;
          midY1 = Math.floor((y1 + ya1) / 2);
          // r1 = Math.abs(Math.floor((x2 - x1) / 2));
          r1 = Math.abs(Math.floor((ya1 - y1) / 2));
        } else {
          // 二四象限
          const k = -1;
          ya1 = (x2 - x1) * k + y1;
          midY1 = Math.floor((y1 + ya1) / 2);
          // r1 = Math.abs(Math.floor((x2 - x1) / 2));
          r1 = Math.abs(Math.floor((ya1 - y1) / 2));
        }
        bresenhamLineCircle(
          this.$store.state.canvasModule.pages[
            this.$store.state.canvasModule.currentPageIndex
          ].layers[this.$store.state.canvasModule.currentLayerIndex],
          midX1,
          midY1,
          r1,
          false,
          (columnIndex: number, rowIndex: number) => {
            drawGrid(canvasCtx, this.tempLayer, columnIndex, rowIndex, color);
          }
        );
      }
      if (mode === "select") {
        const {
          selectArea: { isSet, isMove }
        } = this.$store.state.canvasModule;
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        if (!isSet) {
          // 透明度设置
          canvasCtx.globalAlpha = .3;
          drawGridGroup(canvasCtx, this.tempLayer, x1, y1, x2, y2, "#e2e2e2");
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
      this.$store.dispatch("canvasModule/SET_LASET_START_POINT", {
        e,
        x: x1,
        y: y1
      });
      this.$store.dispatch("canvasModule/SET_LASET_END_POINT", {
        e,
        x: x2,
        y: y2
      });
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
    eraser(this: any, e: MouseEvent) {
      const xIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        yIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      const { backgroundColor: color } = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex][xIndex][
        yIndex
      ];
      drawGrid(
        this.canvasCtx,
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex],
        xIndex,
        yIndex,
        color
      );
      this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex][xIndex][
        yIndex
      ] = {
        ...this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex][xIndex][
          yIndex
        ],
        color: undefined
      };
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
