import { layer } from "types/canvas";
import { drawGrid } from "./canvas";
function boundaryFill4( //递归填充
  layer: layer,
  x: number,
  y: number,
  w: number,
  h: number,
  oldColor: string | undefined,
  newColor: string,
  callback: Function
): void {
  if (
    layer[x][y].color !== newColor &&
    layer[x][y].color === oldColor
  ) {
    const oldColor = layer[x][y].color;
    callback(x, y);
    if (x + 1 < w)
      boundaryFill4(layer, x + 1, y, w, h, oldColor, newColor, callback);
    if (x - 1 >= 0)
      boundaryFill4(layer, x - 1, y, w, h, oldColor, newColor, callback);
    if (y + 1 < h)
      boundaryFill4(layer, x, y + 1, w, h, oldColor, newColor, callback);
    if (y - 1 >= 0)
      boundaryFill4(layer, x, y - 1, w, h, oldColor, newColor, callback);
  }
}
/**
 * 扫描线种子填充函数
 * @param layer 图层数据
 * @param x 横轴坐标
 * @param y 纵轴坐标
 * @param w 画布宽度
 * @param h 画布高度
 * @param newColor 新填充颜色
 * @param oldColor 旧填充颜色
 * @param callback 绘制回调函数
 */
function ScanLineFill(
  canvasCtx: CanvasRenderingContext2D,
  layer: layer,
  layerX: number,
  layerY: number,
  w: number,
  h: number,
  oldColor: string,
  newColor: string
): layer {
  let stack = []; // 构造种子点栈
  let point = layer[layerX][layerY]; //1. 种子入栈
  stack.push(point);
  let x, y, xl, xr, yl;
  while (stack.length > 0) {
    let point: any = stack.pop(); //2.取当前种子点
    x = point.columnIndex;
    y = point.rowIndex;
    xl = xr = x;
    yl = y;
    // 3.向左右填充（在当前点所在扫描线扫描）
    if (point.color === oldColor) {
      //填充颜色
      drawGrid(canvasCtx as CanvasRenderingContext2D, layer, x, y, newColor);
      layer[x][y].color = newColor
        const { x: nxl, y: nyl1 } = Fill(
        canvasCtx,
        layer,
        xl,
        yl,
        w,
        -1,
        oldColor,
        newColor
      ); // x--方向填充，并返回边界点
      (xl = nxl), (yl = nyl1);
      const { x: nxr, y: nyl2 } = Fill(
        canvasCtx,
        layer,
        xr,
        yl,
        w,
        1,
        oldColor,
        newColor
      ); // x++方向填充，并返回边界点
      (xr = nxr), (yl = nyl2);
      // 4.处理相邻两条扫描新线，并获得新种子入栈
      if (y - 1 >= 0) {
        SearchLineNewSeed(stack, layer, xl, xr, y - 1, oldColor, newColor);
      }
      if (y + 1 < h) {
        SearchLineNewSeed(stack, layer, xl, xr, y + 1, oldColor, newColor);
      }
    }
  }
  return layer;
}

function Fill(
  canvasCtx: CanvasRenderingContext2D,
  layer: layer,
  x: number,
  y: number,
  w: number,
  drFlg: number,
  oldColor: string,
  newColor: string
): any {
  if (drFlg === -1) {
    // x--
    for (; x - 1 >= 0 && layer[x - 1][y].color === oldColor; ) {
      layer[--x][y].color = newColor;
      drawGrid(canvasCtx, layer, x, y, newColor);
    }
  } else {
    // x++
    for (; x + 1 < w && layer[x + 1][y].color === oldColor; ) {
      layer[++x][y].color = newColor;
      drawGrid(canvasCtx, layer, x, y, newColor);
    }
  }
  return { x: x, y: y };
}

function SearchLineNewSeed(
  stack: Array<any>,
  layer: layer,
  xLeft: number,
  xRight: number,
  y: number,
  oldColor: string,
  newColor: string
) {
  let xt = xLeft;
  let findNewSeed = false;
  while (xt <= xRight) {
    // 从xl开始到xr，找到新的种子点
    if (layer[xt][y].color === oldColor) {
      findNewSeed = true; // 说明有种子点
      xt++;
      continue;
    } else {
      if (findNewSeed === true) {
        // 当前点不是，则前一点是种子
        stack.push(layer[xt - 1][y]);
        findNewSeed = false;
        xt++;
        continue;
      } else {
        // 没有找到则继续
        xt++;
        continue;
      }
    }
  }
  if (findNewSeed === true) {
    stack.push(layer[xRight][y]); // 把右边界作为种子加入
  }
}

export { ScanLineFill };
