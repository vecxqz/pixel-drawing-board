function initLayer(width: number, height: number, size: number): layer {
  const gridMeta: layer = [];
  for (let column = 0; column < Math.floor(width / size); column += 1) {
    for (let row = 0; row < Math.floor(height / size); row += 1) {
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
  // console.log(color, x, y, size, size);
  canvasCtx.fillRect(x, y, size, size);
}
function drawGridB(
  canvasCtx: CanvasRenderingContext2D,
  {
    columnIndex,
    rowIndex,
    size,
    color
  }: {
    columnIndex: number;
    rowIndex: number;
    size: number;
    color: string;
  }
): void {
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(columnIndex, rowIndex, size, size);
}
function clearGrid(
  canvasCtx: CanvasRenderingContext2D,
  layerMeta: layer,
  columnIndex: number,
  rowIndex: number
): void {
  const { x, y, size } = layerMeta[columnIndex][rowIndex];
  canvasCtx.clearRect(x, y, size, size);
}
function clearGridB(
  canvasCtx: CanvasRenderingContext2D,
  {
    columnIndex,
    rowIndex,
    size
  }: {
    columnIndex: number;
    rowIndex: number;
    size: number;
  }
): void {
  const { width, height } = canvasCtx.canvas;
  const imageData = canvasCtx.getImageData(0, 0, width, height);
  const { data } = imageData;
  let index = 0;
  index = (columnIndex + rowIndex * width) * 4;
  data[index] = 0; // r
  data[index + 1] = 0; // g
  data[index + 2] = 0; // b
  data[index + 3] = 0; // a
  canvasCtx.putImageData(imageData, 0, 0);
  // canvasCtx.clearRect(columnIndex, rowIndex, size, size);
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

function drawGridGroup(
  canvasCtx: CanvasRenderingContext2D,
  layerMeta: layer,
  startColumnIndex: number,
  startRowIndex: number,
  endColumnIndex: number,
  endRowIndex: number,
  color: string
): void {
  canvasCtx.globalAlpha = 0.2;
  const minX = Math.min(startColumnIndex, endColumnIndex);
  const minY = Math.min(startRowIndex, endRowIndex);
  const maxX = Math.max(startColumnIndex, endColumnIndex);
  const maxY = Math.max(startRowIndex, endRowIndex);
  const { x, y, size } = layerMeta[minX][minY];
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(x, y, size * (maxX - minX + 1), size * (maxY - minY + 1));
  canvasCtx.globalAlpha = 1;
}
function drawSelectArea(
  canvasCtx: CanvasRenderingContext2D,
  selectCanvasCtx: CanvasRenderingContext2D,
  layer: layer,
  startColumnIndex: number,
  startRowIndex: number,
  endColumnIndex: number,
  endRowIndex: number,
  size: number,
  coverColor: string
): void {
  const width: number = size * (endColumnIndex - startColumnIndex + 1),
    height: number = size * (endRowIndex - startRowIndex + 1);
  const { x, y } = layer[startColumnIndex][startRowIndex];
  // 获取左上角坐标
  let stepX = undefined;
  let stepY = undefined;
  const minX = Math.min(startColumnIndex, endColumnIndex);
  const minY = Math.min(startRowIndex, endRowIndex);
  const maxX = Math.max(startColumnIndex, endColumnIndex);
  const maxY = Math.max(startRowIndex, endRowIndex);
  for (let startX = minX; startX <= maxX; startX++) {
    for (let startY = minY; startY <= maxY; startY++) {
      const { x, y, color, size } = layer[startX][startY];
      if (stepX === undefined && stepY === undefined) {
        [stepX, stepY] = [x, y];
      }
      if (color) {
        selectCanvasCtx.fillStyle = color as string;
        selectCanvasCtx.fillRect(
          x - (stepX as number),
          y - (stepY as number),
          size,
          size
        );
        selectCanvasCtx.globalAlpha = 0.3;
        selectCanvasCtx.fillStyle = "#000000";
        selectCanvasCtx.fillRect(
          x - (stepX as number),
          y - (stepY as number),
          size,
          size
        );
        selectCanvasCtx.globalAlpha = 1;
      } else {
        selectCanvasCtx.globalAlpha = 0.3;
        selectCanvasCtx.fillStyle = "#000000";
        selectCanvasCtx.fillRect(
          x - (stepX as number),
          y - (stepY as number),
          size,
          size
        );
        selectCanvasCtx.globalAlpha = 1;
      }
    }
  }
}

function drawSquare(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  callback: Function
) {
  // console.log(`(x1:${x1},y1:${y1}),(x2:${x2},y2:${y2})`);
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (x === minX || x == maxX || y === minY || y === maxY) {
        callback(x, y);
      }
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
  drawGridGroup,
  drawSelectArea,
  drawSquare,
  clearGrid,
  drawGridB,
  clearGridB
};
