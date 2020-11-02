<template>
  <div id="canvas">
    <canvas ref="canvas" :width="board.width" :height="board.height"></canvas>
  </div>
</template>

<script lang="ts">
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
        operatorStack: [],
        operatorPopStack: [],
        color: "black",
        tempStack: [],
        startPoint: { e: null, x: null, y: null },
        endPoint: { e: null, x: null, y: null },
        lastStartPoint: { e: null, x: null, y: null },
        lastEndPoint: { e: null, x: null, y: null }
      },
      colors: ["red", "yellow", "blue", "green", "black", "white"],
      mode: "line"
      // mode: "point"
    };
  },
  mounted(this: any) {
    const { canvas } = this.$refs;
    this.ctx = canvas.getContext("2d");
    this.boardInit();
    this.$refs.canvas.addEventListener("mousedown", (e: any) => {
      this.board.tempStack = [];
      this.mouseDown = true;
      this.board.startPoint.e = e;
      this.board.lastStartPoint.x = null;
      this.board.lastStartPoint.y = null;
      this.board.lastEndPoint.x = null;
      this.board.lastEndPoint.y = null;
      this.$refs.canvas.addEventListener("mousemove", this.handleMouseMove);
    });
    this.$refs.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
      this.board.operatorStack.push(this.board.tempStack);
      this.$refs.canvas.removeEventListener("mousemove", this.handleMouseMove);
    });
  },
  methods: {
    boardInit(this: any) {
      for (
        let column = 0;
        column < Math.floor(this.board.width / this.board.gridSize);
        column += 1
      ) {
        for (
          let row = 0;
          row < Math.floor(this.board.height / this.board.gridSize);
          row += 1
        ) {
          const size = this.board.gridSize;
          const x = column * size;
          const y = row * size;
          const columnIndex = column;
          const rowIndex = row;
          if (!Array.isArray(this.board.gridMeta[columnIndex])) {
            this.board.gridMeta[columnIndex] = [];
          }
          // 奇数行奇数列
          if (rowIndex % 2 !== 0 && columnIndex % 2 !== 0) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(x, y, size, size);
            this.board.gridMeta[columnIndex][rowIndex] = {
              columnIndex: columnIndex,
              rowIndex: rowIndex,
              x: x,
              y: y,
              size: size,
              gridBoardColor: "#ffffff"
            };
          }
          // 奇数行偶数列
          if (rowIndex % 2 !== 0 && columnIndex % 2 === 0) {
            this.ctx.fillStyle = "#d9d9d9";
            this.ctx.fillRect(x, y, size, size);
            this.board.gridMeta[columnIndex][rowIndex] = {
              columnIndex: columnIndex,
              rowIndex: rowIndex,
              x: x,
              y: y,
              size: size,
              gridBoardColor: "#d9d9d9"
            };
          }
          // 偶数行奇数列
          if (rowIndex % 2 === 0 && columnIndex % 2 !== 0) {
            this.ctx.fillStyle = "#d9d9d9";
            this.ctx.fillRect(x, y, size, size);
            this.board.gridMeta[columnIndex][rowIndex] = {
              columnIndex: columnIndex,
              rowIndex: rowIndex,
              x: x,
              y: y,
              size: size,
              gridBoardColor: "#d9d9d9"
            };
          }
          // 偶数行偶数列
          if (rowIndex % 2 === 0 && columnIndex % 2 === 0) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(x, y, size, size);
            this.board.gridMeta[columnIndex][rowIndex] = {
              columnIndex: columnIndex,
              rowIndex: rowIndex,
              x: x,
              y: y,
              size: size,
              gridBoardColor: "#ffffff"
            };
          }
        }
      }
    },
    setGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      this.ctx.fillStyle = gridColor ? gridColor : gridBoardColor;
    },
    clearGrid(x: number, y: number) {
      const color = this.getColorToDefalut(x, y);
      this.drawGrid(x, y, color);
    },
    getColorToDefalut(this: any, x: any, y: any) {
      return this.getGridColor(this.board.gridMeta[x][y]);
    },
    getGridColor(this: any, gridMeta: any) {
      const { gridColor, gridBoardColor } = gridMeta;
      return gridColor ? gridColor : gridBoardColor;
    },
    drawGrid(this: any, columnIndex: number, rowIndex: number, color: string) {
      const { x, y, size } = this.board.gridMeta[columnIndex][rowIndex];
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, size, size);
    },
    handleMouseMove(this: any, e: any) {
      this.board.endPoint.e = e;
      if (this.mode === "point") {
        this.draw(e);
      }
      if (this.mode === "line") {
        const x1 = Math.floor(
            this.board.startPoint.e.offsetX / this.board.gridSize
          ),
          y1 = Math.floor(
            this.board.startPoint.e.offsetY / this.board.gridSize
          ),
          x2 = Math.floor(this.board.endPoint.e.offsetX / this.board.gridSize),
          y2 = Math.floor(this.board.endPoint.e.offsetY / this.board.gridSize);
        // const { x: x3, y: y3 } = this.board.lastStartPoint;
        // const { x: x4, y: y4 } = this.board.lastEndPoint;
        // if (x3 !== null && y3 !== null && x4 !== null && y4 !== null) {
        //   this.bresenhamLine(x3, y3, x4, y4, this.clearGrid);
        // }
        this.ctx.fillStyle = "black";
        this.bresenhamLine(x1, y1, x2, y2, this.drawGrid);
        this.board.lastStartPoint.x = x1;
        this.board.lastStartPoint.y = y1;
        this.board.lastEndPoint.x = x2;
        this.board.lastEndPoint.y = y2;
      }
    },
    draw(this: any, e: any) {
      const xIndex = Math.floor(e.offsetX / this.board.gridSize),
        yIndex = Math.floor(e.offsetY / this.board.gridSize),
        x = xIndex * this.board.gridSize,
        y = yIndex * this.board.gridSize;
      this.ctx.fillStyle = this.board.color;
      this.ctx.fillRect(x, y, this.board.gridSize, this.board.gridSize);
      // 记录连续绘制的点
      const result = this.board.tempStack.filter(
        (operator: any) => operator.x === x && operator.y === y
      );
      if (result.length === 0) {
        this.board.tempStack.push(this.board.gridMeta[xIndex][yIndex]);
      }
      this.board.gridMeta[xIndex][yIndex] = {
        ...this.board.gridMeta[xIndex][yIndex],
        gridColor: this.board.color
      };
    },
    redo(this: any) {
      const operators = this.board.operatorStack.pop();
      if (!operators) return;
      const newOperators = operators.map((operator: any) => {
        const { columnIndex, rowIndex } = operator;
        const gridColor = this.getGridColor(operator);
        const tempGird = { ...this.board.gridMeta[columnIndex][rowIndex] };
        const color = this.getGridColor(operator);
        this.drawGrid(columnIndex, rowIndex, color);
        // 更新元数据
        this.board.gridMeta[columnIndex][rowIndex] = {
          ...this.board.gridMeta[columnIndex][rowIndex],
          gridColor: gridColor
        };
        return {
          ...operator,
          ...tempGird
        };
      });
      this.board.operatorPopStack.push(newOperators);
    },
    undo(this: any) {
      const operators = this.board.operatorPopStack.pop();
      if (!operators) return;
      const newOperators = operators.map((operator: any) => {
        const { rowIndex, columnIndex } = operator;
        const gridColor = this.getGridColor(operator);
        const tempGird = { ...this.board.gridMeta[columnIndex][rowIndex] };
        const color = this.getGridColor(operator);
        this.drawGrid(columnIndex, rowIndex, color);
        // 更新元数据
        this.board.gridMeta[columnIndex][rowIndex] = {
          ...this.board.gridMeta[columnIndex][rowIndex],
          gridColor: gridColor
        };
        return {
          ...operator,
          ...tempGird
        };
      });
      this.board.operatorStack.push(newOperators);
    },
    colorSetByChoose(this: any, color: string) {
      this.board.color = color;
    },
    bresenhamLine(
      this: any,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      callback: Function,
      color: string
    ) {
      let w: number = x2 - x1;
      let h: number = y2 - y1;
      const dx: number = (Number(w > 0) << 1) - 1,
        dy: number = (Number(h > 0) << 1) - 1;
      w = Math.abs(w);
      h = Math.abs(h);
      let f, y, x, delta1, delta2;
      if (w > h) {
        f = 2 * h - w;
        delta1 = 2 * h;
        delta2 = (h - w) * 2;
        for (x = x1, y = y1; x != x2; x += dx) {
          callback(x, y, color);
          if (f < 0) {
            f += delta1;
          } else {
            y += dy;
            f += delta2;
          }
        }
        callback(x, y, color);
      } else {
        f = 2 * w - h;
        delta1 = w * 2;
        delta2 = (w - h) * 2;
        for (x = x1, y = y1; y != y2; y += dy) {
          callback(x, y, color);
          if (f < 0) {
            f += delta1;
          } else {
            x += dx;
            f += delta2;
          }
        }
        callback(x, y, color);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  border-top: 1px solid rgba(0,0,0,.5);
  background-color: #141518;
}
</style>
