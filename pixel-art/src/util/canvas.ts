import { cell, layer } from "types/canvas";

function initLayer(width: number, height: number, gridSize: number): layer {
  let gridMeta: layer = [];
  for (let column = 0; column < Math.floor(width / gridSize); column += 1) {
    for (let row = 0; row < Math.floor(height / gridSize); row += 1) {
      const size = gridSize;
      const x = column * size;
      const y = row * size;
      const columnIndex = column;
      const rowIndex = row;
      if (!Array.isArray(gridMeta[columnIndex])) {
        gridMeta[columnIndex] = [];
      }
      // 奇数行奇数列
      if (rowIndex % 2 !== 0 && columnIndex % 2 !== 0) {
        gridMeta[columnIndex][rowIndex] = {
          columnIndex,
          rowIndex,
          x,
          y,
          size,
          backgroundColor: "#ffffff"
        } as cell;
      }
      // 奇数行偶数列
      if (rowIndex % 2 !== 0 && columnIndex % 2 === 0) {
        gridMeta[columnIndex][rowIndex] = {
          columnIndex,
          rowIndex,
          x,
          y,
          size,
          backgroundColor: "#d9d9d9"
        };
      }
      // 偶数行奇数列
      if (rowIndex % 2 === 0 && columnIndex % 2 !== 0) {
        gridMeta[columnIndex][rowIndex] = {
          columnIndex,
          rowIndex,
          x,
          y,
          size,
          backgroundColor: "#d9d9d9"
        };
      }
      // 偶数行偶数列
      if (rowIndex % 2 === 0 && columnIndex % 2 === 0) {
        gridMeta[columnIndex][rowIndex] = {
          columnIndex,
          rowIndex,
          x,
          y,
          size,
          backgroundColor: "#ffffff"
        };
      }
    }
  }
  return gridMeta;
}

export { initLayer };
