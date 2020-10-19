<template>
  <div id="canvas">
    <canvas
      ref="canvas"
      :width="$store.state.canvasModule.width"
      :height="$store.state.canvasModule.height"
    ></canvas>
  </div>
</template>

<script lang="ts">
import {
  bresenhamLine,
  bresenhamLineCircle,
  drawGrid,
  initGrid,
  drawGridGroup
} from "../util/canvas";
import { ScanLineFill as boundaryFill4 } from "../util/fill";
import { isUndefined } from "../util/common";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, debounceTime } from "rxjs/operators";
export default {
  name: "Canvas",
  data() {
    return {
      imageData: undefined
    };
  },
  computed: {
    tempLayer(this: any) {
      return this.$store.state.canvasModule.tempLayer;
      // return { ...this.$store.state.canvasModule.pages[this.$store.state.canvasModule.currentPageIndex].layers[this.$store.state.canvasModule.currentLayerIndex] };
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
    this.$store.dispatch("canvasModule/CREATE_PAGE");
    this.$store.dispatch("canvasModule/CREATE_TEMP_LAYER");
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.parse();
    const mouseDown = fromEvent(canvas, "mousedown");
    const mouseMove = fromEvent(canvas, "mousemove");
    const mouseUp = fromEvent(canvas, "mouseup");
    mouseDown
      .pipe(
        tap(e => {
          this.$store.dispatch("canvasModule/SET_START_POINT", { e });
          this.$store.dispatch("canvasModule/SET_LASET_START_POINT", { e });
          this.$store.dispatch("canvasModule/SET_LASET_END_POINT", { e });
        }),
        map(() =>
          mouseMove.pipe(
            takeUntil(
              mouseUp.pipe(
                tap(e => {
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
                  this.canvasImageDataSaveClean();
                  if (mode === "pencil") {
                    drawGrid(
                      canvasCtx as CanvasRenderingContext2D,
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
                    bresenhamLine(
                      x1,
                      y1,
                      x2,
                      y2,
                      (columnIndex: number, rowIndex: number) => {
                        drawGrid(
                          canvasCtx as CanvasRenderingContext2D,
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
                              canvasCtx as CanvasRenderingContext2D,
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
                              canvasCtx as CanvasRenderingContext2D,
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
                              canvasCtx as CanvasRenderingContext2D,
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
                              canvasCtx as CanvasRenderingContext2D,
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
                          canvasCtx as CanvasRenderingContext2D,
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
                        this.canvasCtx,
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
                  if (mode === "coolPicker") {
                    const color = this.$store.state.canvasModule.pages[
                      this.$store.state.canvasModule.currentPageIndex
                    ].layers[this.$store.state.canvasModule.currentLayerIndex][
                      columnIndex
                    ][rowIndex].color;
                    this.$store.dispatch("canvasModule/SET_COLOR", color);
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
                    const {
                      selectArea: { startX, startY, endX, endY, isSet }
                    } = this.$store.state.canvasModule;
                    if (!isSet) {
                      let selectArea: Array<any> = [];
                      for (let x = startX; x < endX; x++) {
                        for (let y = startY; y < endY; y++) {
                          if (!Array.isArray(selectArea[x])) {
                            selectArea[x] = [];
                          }
                          selectArea[x][
                            y
                          ] = this.$store.state.canvasModule.pages[
                            this.$store.state.canvasModule.currentPageIndex
                          ].layers[
                            this.$store.state.canvasModule.currentLayerIndex
                          ][x][y];
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
                      console.log(selectArea);
                    } else {
                      const {
                        selectArea: { startX, startY, endX, endY, data }
                      } = this.$store.state.canvasModule;
                      console.log(columnIndex, rowIndex);
                      if (
                        columnIndex >= startX &&
                        columnIndex <= endX &&
                        rowIndex >= startY &&
                        rowIndex <= endY
                      ) {
                        console.log("logic");
                      } else {
                        for (let x = 0; x < data.length; x++) {
                          for (let y = 0; y < data[0].length; y++) {
                            const {
                              columnIndex,
                              rowIndex,
                              color,
                              backgroundColor
                            } = data[x][y];
                            drawGrid(
                              this.canvasCtx as CanvasRenderingContext2D,
                              this.$store.state.canvasModule.pages[
                                this.$store.state.canvasModule.currentPageIndex
                              ].layers[
                                this.$store.state.canvasModule.currentLayerIndex
                              ],
                              columnIndex,
                              rowIndex,
                              color ? color : backgroundColor
                            );
                          }
                        }
                        this.$store.dispatch(
                          "canvasModule/SET_SELECT_AREA_SET_STATUS",
                          false
                        );
                      }
                      console.log("normal");
                    }
                    // canvasCtx.globalAlpha = 0.2;
                    // drawGridGroup(
                    //   canvasCtx as CanvasRenderingContext2D,
                    //   this.tempLayer,
                    //   x1,
                    //   y1,
                    //   x2,
                    //   y2,
                    //   "black"
                    // );
                    // canvasCtx.globalAlpha = 1;
                  }
                })
              )
            )
          )
        ),
        debounceTime(0, animationFrameScheduler),
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
      const { color, colorDef } = this.getColorToDefalut(x, y);
      drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex],
        x,
        y,
        color
      );
      this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y] = {
        ...this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y],
        color: colorDef ? color : undefined
      };
    },
    getColorToDefalut(this: any, x: any, y: any) {
      return this.getGridColor(
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[this.$store.state.canvasModule.currentLayerIndex][x][y]
      );
    },
    getGridColor(this: any, gridMeta: any) {
      const { color, backgroundColor } = gridMeta;
      return color
        ? {
            color: color,
            colorDef: true
          }
        : {
            color: backgroundColor,
            colorDef: false
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
        drawGrid(
          canvasCtx as CanvasRenderingContext2D,
          this.tempLayer,
          columnIndex,
          rowIndex,
          color
        );
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
            drawGrid(
              canvasCtx as CanvasRenderingContext2D,
              this.tempLayer,
              columnIndex,
              rowIndex,
              color
            );
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
                drawGrid(
                  canvasCtx as CanvasRenderingContext2D,
                  this.tempLayer,
                  startX,
                  startY,
                  color
                );
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
                  canvasCtx as CanvasRenderingContext2D,
                  this.tempLayer,
                  startX,
                  startY,
                  color
                );
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
                  canvasCtx as CanvasRenderingContext2D,
                  this.tempLayer,
                  startX,
                  startY,
                  color
                );
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
                  canvasCtx as CanvasRenderingContext2D,
                  this.tempLayer,
                  startX,
                  startY,
                  color
                );
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
            drawGrid(
              canvasCtx as CanvasRenderingContext2D,
              this.tempLayer,
              columnIndex,
              rowIndex,
              color
            );
          }
        );
      }
      if (mode === "select") {
        // 存储在进行绘制之前的画布数据
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        canvasCtx.putImageData(this.imageData, 0, 0);
        // 透明度设置
        canvasCtx.globalAlpha = 0.2;
        drawGridGroup(
          canvasCtx as CanvasRenderingContext2D,
          this.tempLayer,
          x1,
          y1,
          x2,
          y2,
          "black"
        );
        canvasCtx.globalAlpha = 1;
        this.$store.dispatch("canvasModule/SET_SELECT_AREA_START_COORDINATE", {
          x: x1,
          y: y1
        });
        this.$store.dispatch("canvasModule/SET_SELECT_AREA_END_COORDINATE", {
          x: x2,
          y: y2
        });
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
        this.canvasCtx as CanvasRenderingContext2D,
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
</style>
