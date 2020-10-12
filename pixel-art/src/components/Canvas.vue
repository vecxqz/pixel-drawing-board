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
import { bresenhamLine, drawGrid } from "../util/canvas";
import { isUndefined } from "../util/common";
export default {
  name: "Canvas",
  data() {
    return {
      mouseDown: false,
      // mode: "line"
      mode: "point"
    };
  },
  computed: {
    canvasCtx(this: any) {
      return this.$store.state.canvasModule.canvasCtx;
    }
  },
  mounted(this: any) {
    const { canvas } = this.$refs;
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.parse();
    this.$refs.canvas.addEventListener("mousedown", (e: any) => {
      this.mouseDown = true;
      this.$store.dispatch("canvasModule/SET_START_POINT", { e });
      this.$store.dispatch("canvasModule/SET_LASET_START_POINT", { e });
      this.$store.dispatch("canvasModule/SET_LASET_END_POINT", { e });
      this.$refs.canvas.addEventListener("mousemove", (e: MouseEvent) => {
        const { mouseDown }: { mouseDown: Boolean } = this;
        if (mouseDown) {
          this.handleMouseMove(e);
        }
      });
    });
    this.$refs.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
      const {
        currentPageIndex,
        currentLayerIndex,
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
      if (mode === "line") {
        this.bresenhamLine(
          x1,
          y1,
          x2,
          y2,
          (columnIndex: number, rowIndex: number) => {
            this.drawGrid(
              canvasCtx as CanvasRenderingContext2D,
              this.$store.state.canvasModule.pages[currentPageIndex].layers[
                currentLayerIndex
              ],
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
                  this.$store.state.canvasModule.pages[currentPageIndex].layers[
                    currentLayerIndex
                  ],
                  startX,
                  startY,
                  color
                );
                this.$store.state.canvasModule.pages[currentPageIndex].layers[
                  currentLayerIndex
                ][startX][startY] = {
                  ...this.$store.state.canvasModule.pages[currentPageIndex]
                    .layers[currentLayerIndex][startX][startY],
                  color
                };
              }
            }
        } else {
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
                  this.$store.state.canvasModule.pages[currentPageIndex].layers[
                    currentLayerIndex
                  ],
                  startX,
                  startY,
                  color
                );
                this.$store.state.canvasModule.pages[currentPageIndex].layers[
                  currentLayerIndex
                ][startX][startY] = {
                  ...this.$store.state.canvasModule.pages[currentPageIndex]
                    .layers[currentLayerIndex][startX][startY],
                  color
                };
              }
            }
        }
      }
      this.$refs.canvas.removeEventListener("mousemove", (e: MouseEvent) =>
        this.handleMouseMove(e)
      );
    });
  },
  methods: {
    setGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      this.canvasCtx.fillStyle = gridColor ? gridColor : gridBoardColor;
    },
    clearGrid(this: any, x: number, y: number) {
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      const color = this.getColorToDefalut(x, y);
      this.drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ],
        x,
        y,
        color
      );
    },
    getColorToDefalut(this: any, x: any, y: any) {
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      return this.getGridColor(
        this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ][x][y]
      );
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
        currentPageIndex,
        currentLayerIndex,
        canvasCtx,
        color,
        mode,
        size,
        eventPoint: { startPoint, endPoint }
      } = this.$store.state.canvasModule;
      this.$store.dispatch("canvasModule/SET_END_POINT", { e });
      this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      if (mode === "pecil") {
        // this.draw(e);
        this.drawGrid(
          canvasCtx as CanvasRenderingContext2D,
          this.$store.state.canvasModule.tempLayer,
          columnIndex,
          rowIndex,
          color
        );
        this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ][columnIndex][rowIndex] = {
          ...this.$store.state.canvasModule.pages[currentPageIndex].layers[
            currentLayerIndex
          ][columnIndex][rowIndex],
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
          } else {
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
        } else {
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
    draw(this: any, e: any) {
      const {
        currentPageIndex,
        currentLayerIndex,
        color
      } = this.$store.state.canvasModule;
      const xIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        yIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      this.drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ],
        xIndex,
        yIndex,
        color
      );
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ][xIndex][yIndex] = {
        ...this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ][xIndex][yIndex],
        color
      };
    },
    parse(this: any) {
      setTimeout(() => {
        const {
          currentPageIndex,
          currentLayerIndex
        } = this.$store.state.canvasModule;
        const layer = this.$store.state.canvasModule.pages[currentPageIndex]
          .layers[currentLayerIndex];
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
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      const xIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        yIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      const { backgroundColor: color } = this.$store.state.canvasModule.pages[
        currentPageIndex
      ].layers[currentLayerIndex][xIndex][yIndex];
      this.drawGrid(
        this.canvasCtx as CanvasRenderingContext2D,
        this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ],
        xIndex,
        yIndex,
        color
      );
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ][xIndex][yIndex] = {
        ...this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ][xIndex][yIndex],
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
