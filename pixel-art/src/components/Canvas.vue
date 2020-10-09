<template>
  <div id="canvas">
    <canvas ref="canvas" :width="board.width" :height="board.height"></canvas>
  </div>
</template>

<script lang="ts">
import { bresenhamLine, drawGrid } from "../util/canvas";
export default {
  name: "Canvas",
  data() {
    return {
      mouseDown: false,
      ctx: null,
      board: {
        width: 600,
        height: 600,
        gridSize: 10,
        rowCount: 0,
        columnCount: 0,
        gridMeta: [],
        color: "black"
      },
      // mode: "line"
      mode: "point"
    };
  },
  mounted(this: any) {
    const { canvas } = this.$refs;
    this.$store.state.canvasModule.canvasCtx = canvas.getContext("2d");
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.parse();
    this.$refs.canvas.addEventListener("mousedown", (e: any) => {
      this.mouseDown = true;
      this.$store.dispatch("canvasModule/SET_START_POINT", { e });
      this.$store.dispatch("canvasModule/SET_LASET_START_POINT", { e });
      this.$store.dispatch("canvasModule/SET_LASET_END_POINT", { e });
      console.log(this.$store.state.canvasModule);
      this.$refs.canvas.addEventListener("mousemove", (e: MouseEvent) => {
        const { mouseDown }: { mouseDown: Boolean } = this;
        if (mouseDown) {
          this.handleMouseMove(e);
        }
      });
    });
    this.$refs.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
      this.$refs.canvas.removeEventListener("mousemove", (e: MouseEvent) =>
        this.handleMouseMove(e)
      );
    });
  },
  methods: {
    setGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      this.$store.state.canvasModule.canvasCtx.fillStyle = gridColor
        ? gridColor
        : gridBoardColor;
    },
    clearGrid(this: any, x: number, y: number) {
      const color = this.getColorToDefalut(x, y);
      this.drawGrid(
        this.$store.state.canvasModule.canvasCtx,
        this.board.gridMeta,
        x,
        y,
        color
      );
    },
    getColorToDefalut(this: any, x: any, y: any) {
      return this.getGridColor(this.board.gridMeta[x][y]);
    },
    getGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      return gridColor ? gridColor : gridBoardColor;
    },
    handleMouseMove(this: any, e: any) {
      this.$store.dispatch("canvasModule/SET_END_POINT", { e });
      if (this.mode === "point") {
        this.draw(e);
      }
      if (this.mode === "line") {
        const x1 = Math.floor(
            this.$store.state.canvasModule.eventPoint.startPoint.e.offsetX /
              this.board.gridSize
          ),
          y1 = Math.floor(
            this.$store.state.canvasModule.eventPoint.startPoint.e.offsetY /
              this.board.gridSize
          ),
          x2 = Math.floor(
            this.$store.state.canvasModule.eventPoint.endPoint.e.offsetX /
              this.board.gridSize
          ),
          y2 = Math.floor(
            this.$store.state.canvasModule.eventPoint.endPoint.e.offsetX /
              this.board.gridSize
          );
        // const {
        //   x: x3,
        //   y: y3
        // } = this.$store.state.canvasModule.eventPoint.lastStartPoint;
        // const {
        //   x: x4,
        //   y: y4
        // } = this.$store.state.canvasModule.eventPoint.lastEndPoint;
        // if (x3 !== null && y3 !== null && x4 !== null && y4 !== null) {
        //   this.bresenhamLine(x3, y3, x4, y4, this.clearGrid);
        // }
        this.$store.state.canvasModule.canvasCtx.fillStyle = "black";
        this.bresenhamLine(
          x1,
          y1,
          x2,
          y2,
          (columnIndex: number, rowIndex: number) => {
            this.drawGrid(
              this.$store.state.canvasModule
                .canvasCtx as CanvasRenderingContext2D,
              this.board.gridMeta,
              columnIndex,
              rowIndex,
              "black"
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
    draw(this: any, e: any) {
      const {
        currentPageIndex,
        currentLayerIndex,
        color
      } = this.$store.state.canvasModule;
      const xIndex = Math.floor(e.offsetX / this.board.gridSize),
        yIndex = Math.floor(e.offsetY / this.board.gridSize);
      this.drawGrid(
        this.$store.state.canvasModule.canvasCtx as CanvasRenderingContext2D,
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
              this.$store.state.canvasModule.canvasCtx,
              layer,
              i,
              j,
              color ? color : backgroundColor
            );
          }
      }, 10);
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
