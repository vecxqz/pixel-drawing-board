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
import { bresenhamLine, bresenhamLineCircle, drawGrid } from "../util/canvas";
import { isUndefined } from "../util/common";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, debounceTime } from "rxjs/operators";
export default {
  name: "Canvas",
  data() {
    return {};
  },
  computed: {
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
                  const columnIndex = Math.floor(
                      e.offsetX / this.$store.state.canvasModule.size
                    ),
                    rowIndex = Math.floor(
                      e.offsetY / this.$store.state.canvasModule.size
                    );
                  this.$store.dispatch("canvasModule/SET_END_POINT", { e });
                  this.$store.dispatch(
                    "canvasModule/SET_COLUMN_INDEX",
                    columnIndex
                  );
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
                  console.log(mode);
                  if (mode === "pencil") {
                    this.drawGrid(
                      canvasCtx as CanvasRenderingContext2D,
                      this.$store.state.canvasModule.tempLayer,
                      columnIndex,
                      rowIndex,
                      color
                    );
                    this.currentLayer[columnIndex][rowIndex] = {
                      ...this.currentLayer[columnIndex][rowIndex],
                      color
                    };
                  }
                  if (mode === "line") {
                    this.bresenhamLine(
                      x1,
                      y1,
                      x2,
                      y2,
                      (columnIndex: number, rowIndex: number) => {
                        this.drawGrid(
                          canvasCtx as CanvasRenderingContext2D,
                          this.currentLayer,
                          columnIndex,
                          rowIndex,
                          color
                        );
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
                            this.drawGrid(
                              canvasCtx as CanvasRenderingContext2D,
                              this.currentLayer,
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
                            this.drawGrid(
                              canvasCtx as CanvasRenderingContext2D,
                              this.currentLayer,
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
                            this.drawGrid(
                              canvasCtx as CanvasRenderingContext2D,
                              this.currentLayer,
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
                            this.drawGrid(
                              canvasCtx as CanvasRenderingContext2D,
                              this.currentLayer,
                              startX,
                              startY,
                              color
                            );
                          }
                        }
                    }
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
                      midX1,
                      midY1,
                      r1,
                      false,
                      (columnIndex: number, rowIndex: number) => {
                        this.drawGrid(
                          canvasCtx as CanvasRenderingContext2D,
                          this.currentLayer,
                          columnIndex,
                          rowIndex,
                          color
                        );
                      }
                    );
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
      const color = this.getColorToDefalut(x, y);
      this.drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.currentLayer,
        x,
        y,
        color
      );
    },
    getColorToDefalut(this: any, x: any, y: any) {
      return this.getGridColor(this.currentLayer[x][y]);
    },
    getGridColor(this: any, gridMeta: any) {
      const { color, backgroundColor } = gridMeta;
      return color ? color : backgroundColor;
    },
    handleMouseMove(this: any, e: any) {
      const columnIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        rowIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      const {
        canvasCtx,
        color,
        mode,
        size,
        eventPoint: { startPoint, endPoint }
      } = this.$store.state.canvasModule;
      this.$store.dispatch("canvasModule/SET_END_POINT", { e });
      this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      if (mode === "pencil") {
        this.drawGrid(
          canvasCtx as CanvasRenderingContext2D,
          this.$store.state.canvasModule.tempLayer,
          columnIndex,
          rowIndex,
          color
        );
        this.currentLayer[columnIndex][rowIndex] = {
          ...this.currentLayer[columnIndex][rowIndex],
          color
        };
      }
      if (mode === "line") {
        const x1 = Math.floor(startPoint.e.offsetX / size),
          y1 = Math.floor(startPoint.e.offsetY / size),
          x2 = Math.floor(endPoint.e.offsetX / size),
          y2 = Math.floor(endPoint.e.offsetY / size);
        const {
          x: x3,
          y: y3
        } = this.$store.state.canvasModule.eventPoint.lastStartPoint;
        const {
          x: x4,
          y: y4
        } = this.$store.state.canvasModule.eventPoint.lastEndPoint;
        if (
          !isUndefined(x3) &&
          !isUndefined(y3) &&
          !isUndefined(x4) &&
          !isUndefined(y4)
        ) {
          this.bresenhamLine(
            x3,
            y3,
            x4,
            y4,
            (columnIndex: number, rowIndex: number) => {
              this.clearGrid(columnIndex, rowIndex);
            }
          );
        }
        this.bresenhamLine(
          x1,
          y1,
          x2,
          y2,
          (columnIndex: number, rowIndex: number) => {
            this.drawGrid(
              canvasCtx as CanvasRenderingContext2D,
              this.$store.state.canvasModule.tempLayer,
              columnIndex,
              rowIndex,
              color
            );
          }
        );
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
      }
      if (mode === "eraser") {
        this.eraser(e);
      }
      if (mode === "square") {
        const x1 = Math.floor(startPoint.e.offsetX / size),
          y1 = Math.floor(startPoint.e.offsetY / size),
          x2 = Math.floor(endPoint.e.offsetX / size),
          y2 = Math.floor(endPoint.e.offsetY / size);
        const {
          x: x3,
          y: y3
        } = this.$store.state.canvasModule.eventPoint.lastStartPoint;
        const {
          x: x4,
          y: y4
        } = this.$store.state.canvasModule.eventPoint.lastEndPoint;
        if (
          !isUndefined(x3) &&
          !isUndefined(y3) &&
          !isUndefined(x4) &&
          !isUndefined(y4)
        ) {
          if (x3 <= x4 || y3 <= y4) {
            for (let startX = x3; startX <= x4; startX++)
              for (let startY = y3; startY <= y4; startY++) {
                if (
                  startX === x3 ||
                  startX === x4 ||
                  startY === y3 ||
                  startY === y4
                ) {
                  this.clearGrid(startX, startY);
                }
              }
          }
          if (x3 <= x4 || y3 >= y4) {
            for (let startX = x3; startX <= x4; startX++)
              for (let startY = y3; startY >= y4; startY--) {
                if (
                  startX === x3 ||
                  startX === x4 ||
                  startY === y3 ||
                  startY === y4
                ) {
                  this.clearGrid(startX, startY);
                }
              }
          }
          if (x3 >= x4 || y3 >= y4) {
            for (let startX = x3; startX >= x4; startX--)
              for (let startY = y3; startY >= y4; startY--) {
                if (
                  startX === x3 ||
                  startX === x4 ||
                  startY === y3 ||
                  startY === y4
                ) {
                  this.clearGrid(startX, startY);
                }
              }
          }
          if (x3 >= x4 || y3 <= y4) {
            for (let startX = x3; startX >= x4; startX--)
              for (let startY = y3; startY <= y4; startY++) {
                if (
                  startX === x3 ||
                  startX === x4 ||
                  startY === y3 ||
                  startY === y4
                ) {
                  this.clearGrid(startX, startY);
                }
              }
          }
        }
        if (x1 <= x2 || y1 <= y2) {
          for (let startX = x1; startX <= x2; startX++)
            for (let startY = y1; startY <= y2; startY++) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                this.drawGrid(
                  canvasCtx as CanvasRenderingContext2D,
                  this.$store.state.canvasModule.tempLayer,
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
                this.drawGrid(
                  canvasCtx as CanvasRenderingContext2D,
                  this.$store.state.canvasModule.tempLayer,
                  startX,
                  startY,
          for (let startX = x1; startX >= x2; startX--)
            for (let startY = y1; startY >= y2; startY--) {
              if (
                startX === x1 ||
                startX === x2 ||
                startY === y1 ||
                startY === y2
              ) {
                this.drawGrid(
                  canvasCtx as CanvasRenderingContext2D,
                  this.$store.state.canvasModule.tempLayer,
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
                this.drawGrid(
                  canvasCtx as CanvasRenderingContext2D,
                  this.$store.state.canvasModule.tempLayer,
                  startX,
                  startY,
                  color
                );
              }
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
      }
      if (mode === "circle") {
        const x1 = Math.floor(startPoint.e.offsetX / size),
          y1 = Math.floor(startPoint.e.offsetY / size),
          x2 = Math.floor(endPoint.e.offsetX / size),
          y2 = Math.floor(endPoint.e.offsetY / size);
        const {
          x: x3,
          y: y3
        } = this.$store.state.canvasModule.eventPoint.lastStartPoint;
        const {
          x: x4,
          y: y4
        } = this.$store.state.canvasModule.eventPoint.lastEndPoint;
        // 防止圆贴着圆心形成的直角坐标系的边飘逸
        let midX1, midY1, r1, midX2, midY2, r2, ya1, ya2;
        // 一三象限
        midX1 = Math.floor((x2 + x1) / 2);
        midX2 = Math.floor((x4 + x3) / 2);
        if ((x2 < x1 && y2 < y1) || (x2 > x1 && y2 > x1)) {
          const k = 1;
          ya1 = (x2 - x1) * k + y1;
          ya2 = (x4 - x3) * k + y3;
          midY1 = Math.floor((y1 + ya1) / 2);
          midY2 = Math.floor((y3 + ya2) / 2);
          // r1 = Math.abs(Math.floor((x2 - x1) / 2));
          // r2 = Math.abs(Math.floor((x4 - x3) / 2));
          r1 = Math.abs(Math.floor((ya1 - y1) / 2));
          r2 = Math.abs(Math.floor((ya2 - y3) / 2));
        } else {
          // 二四象限
          const k = -1;
          ya1 = (x2 - x1) * k + y1;
          ya2 = (x4 - x3) * k + y3;
          midY1 = Math.floor((y1 + ya1) / 2);
          midY2 = Math.floor((y3 + ya2) / 2);
          // r1 = Math.abs(Math.floor((x2 - x1) / 2));
          // r2 = Math.abs(Math.floor((x4 - x3) / 2));
          r1 = Math.abs(Math.floor((ya1 - y1) / 2));
          r2 = Math.abs(Math.floor((ya2 - y3) / 2));
        }
        if (
          !isUndefined(x3) &&
          !isUndefined(y3) &&
          !isUndefined(x4) &&
          !isUndefined(y4)
        ) {
          bresenhamLineCircle(
            midX2,
            midY2,
            r2,
            false,
            (columnIndex: number, rowIndex: number) => {
              this.clearGrid(columnIndex, rowIndex);
            }
          );
        }
        bresenhamLineCircle(
          midX1,
          midY1,
          r1,
          false,
          (columnIndex: number, rowIndex: number) => {
            this.drawGrid(
              canvasCtx as CanvasRenderingContext2D,
              this.$store.state.canvasModule.tempLayer,
              columnIndex,
              rowIndex,
              color
            );
          }
        );
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
      }
    },
    parse(this: any) {
      setTimeout(() => {
        const layer = this.currentLayer;
        for (let i = 0; i < layer.length; i++)
          for (let j = 0; j < layer.length; j++) {
            const cell = layer[i][j];
            const { color, backgroundColor } = cell;
            this.drawGrid(
              this.canvasCtx,
              layer,
              i,
              j,
              color ? color : backgroundColor
            );
          }
      }, 10);
    },
    eraser(this: any, e: MouseEvent) {
      const xIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        yIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      const { backgroundColor: color } = this.currentLayer[xIndex][yIndex];
      this.drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.currentLayer,
        xIndex,
        yIndex,
        color
      );
      this.currentLayer[xIndex][yIndex] = {
        ...this.currentLayer[xIndex][yIndex],
        color
      };
    },
    bresenhamLine,
    drawGrid
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #141518;
}
</style>
