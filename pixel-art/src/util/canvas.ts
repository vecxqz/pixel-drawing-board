import { cell, layer } from "types/canvas";

function initLayer(width: number, height: number, gridSize: number): layer {
  const gridMeta: layer = [];
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
function parseLayer(canvas: HTMLCanvasElement, layerMeta: layer): void {
  const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const columnLen = layerMeta.length;
  const rowLen = layerMeta[0].length;
  for (let columnIndex = 0; columnIndex < columnLen; columnIndex++) {
    for (let rowIndex = 0; rowIndex < rowLen; rowIndex++) {
      const color = layerMeta[columnIndex][rowIndex].color
        ? layerMeta[columnIndex][rowIndex].color
        : layerMeta[columnIndex][rowIndex].backgroundColor;
      initGrid(canvasCtx, layerMeta, columnIndex, rowIndex, color as string);
    }
  }
}
function drawGrid(
  canvasCtx: CanvasRenderingContext2D,
  layerMeta: layer,
  columnIndex: number,
  rowIndex: number,
  color: string
): void {
  const { x, y, size } = layerMeta[columnIndex][rowIndex];
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(x, y, size, size);
}
function initGrid(
  canvasCtx: CanvasRenderingContext2D,
  layerMeta: layer,
  columnIndex: number,
  rowIndex: number,
  color: string
): void {
  const { x, y, size } = layerMeta[columnIndex][rowIndex];
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(x, y, size, size);
}
function bresenhamLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  callback: Function /**将下标传入回调函数，后续操作交给回调函数完成 */
): void {
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
      callback(x, y);
      if (f < 0) {
        f += delta1;
      } else {
        y += dy;
        f += delta2;
      }
    }
    callback(x, y);
  } else {
    f = 2 * w - h;
    delta1 = w * 2;
    delta2 = (w - h) * 2;
    for (x = x1, y = y1; y != y2; y += dy) {
      callback(x, y);
      if (f < 0) {
        f += delta1;
      } else {
        x += dx;
        f += delta2;
      }
    }
    callback(x, y);
  }
}

function _draw_circle_8(
  xc: number,
  yc: number,
  x: number,
  y: number,
  callback: Function
): void {
  callback(xc + x, yc + y);
  callback(xc - x, yc + y);
  callback(xc + x, yc - y);
  callback(xc - x, yc - y);
  callback(xc + y, yc + x);
  callback(xc - y, yc + x);
  callback(xc + y, yc - x);
  callback(xc - y, yc - x);
}

function bresenhamLineCircle(
  layer: layer,
  xc: number,
  yc: number,
  r: number,
  fill: Boolean,
  callback: Function
): void {
  let x = 0,
    y = r,
    yi,
    d;
  d = 3 - 2 * r;
  if (fill) {
    while (x <= y) {
      for (yi = x; yi <= y; yi++) _draw_circle_8(xc, yc, x, yi, callback);

      if (d < 0) {
        d = d + 4 * x + 6;
      } else {
        d = d + 4 * (x - y) + 10;
        y--;
      }
      x++;
    }
  } else {
    while (x <= y) {
      _draw_circle_8(xc, yc, x, y, callback);

      if (d < 0) {
        d = d + 4 * x + 6;
      } else {
        d = d + 4 * (x - y) + 10;
        y--;
      }
      x++;
    }
  }
}

export {
  initLayer,
  parseLayer,
  drawGrid,
  initGrid,
  bresenhamLine,
  bresenhamLineCircle,
};
