import { drawGrid } from "./canvas";
import { useCanvas } from "../composables/useCanvas";
const { calcColor } = useCanvas();
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
  if (layer[x][y].color !== newColor && layer[x][y].color === oldColor) {
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
) {
  // console.log(newColor);
  const imageData = canvasCtx.getImageData(0, 0, 80, 80);
  let stack = []; // 构造种子点栈
  // let point = layer[layerX][layerY]; //1.
  let point = {
    columnIndex: layerX,
    rowIndex: layerY
  };
  stack.push(point);
  let x, y, xl, xr, yl;
  let ct = 0;
  while (stack.length > 0 && ct < 2000) {
    ct += 1;
    let { columnIndex, rowIndex }: any = stack.pop(); //2.取当前种子点
    const { rgb: color } = calcColor(imageData, columnIndex, rowIndex);
    // console.log(color, columnIndex, rowIndex);
    x = columnIndex;
    y = rowIndex;
    xl = xr = x;
    yl = y;
    // 3.向左右填充（在当前点所在扫描线扫描）
    // console.log(color);
    if (color === oldColor) {
      //填充颜色
      drawGrid(canvasCtx as CanvasRenderingContext2D, layer, x, y, newColor);
      const { x: nxl, y: nyl1 } = Fill(
        canvasCtx,
        imageData,
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
        imageData,
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
        // console.log(y - 1);
        SearchLineNewSeed(
          stack,
          imageData,
          layer,
          xl,
          xr,
          y - 1,
          oldColor,
          newColor
        );
      }
      if (y + 1 < h) {
        SearchLineNewSeed(
          stack,
          imageData,
          layer,
          xl,
          xr,
          y + 1,
          oldColor,
          newColor
        );
      }
    }
  }
}

function Fill(
  canvasCtx: CanvasRenderingContext2D,
  imageData: ImageData,
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
    for (; x - 1 >= 0 && calcColor(imageData, x - 1, y).rgb === oldColor; ) {
      --x;
      drawGrid(canvasCtx, layer, x, y, newColor);
    }
  } else {
    // x++
    for (; x + 1 < w && calcColor(imageData, x + 1, y).rgb === oldColor; ) {
      ++x;
      drawGrid(canvasCtx, layer, x, y, newColor);
    }
  }
  // console.log(x, y);
  return { x: x, y: y };
}

function SearchLineNewSeed(
  stack: Array<any>,
  imageData: ImageData,
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
    if (calcColor(imageData, xt, y).rgb === oldColor) {
      findNewSeed = true; // 说明有种子点
      xt++;
      continue;
    } else {
      if (findNewSeed === true) {
        // 当前点不是，则前一点是种子
        stack.push({
          columnIndex: xt - 1,
          rowIndex: y
        });
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
    stack.push({
      columnIndex: xRight,
      rowIndex: y
    }); // 把右边界作为种子加入
  }
}

export { ScanLineFill };
