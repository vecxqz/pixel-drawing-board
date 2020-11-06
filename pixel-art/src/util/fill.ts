import { drawGridB } from "./canvas";
import { useCanvas } from "../composables/useCanvas";
const { calcColor } = useCanvas();
function boundaryFill4( //递归填充
  canvasCtx: CanvasRenderingContext2D,
  // imageData: ImageData,
  x: number,
  y: number,
  w: number,
  h: number,
  oldColor: string | undefined,
  newColor: string
): void {
  const imageData = canvasCtx.getImageData(0, 0, 80, 80);
  const color = calcColor(imageData, x, y).rgb;
  if (color !== newColor && color === oldColor) {
    drawGridB(canvasCtx as CanvasRenderingContext2D, {
      columnIndex: x,
      rowIndex: y,
      size: 1,
      color: newColor
    });
    if (x + 1 < w) {
      boundaryFill4(canvasCtx, x + 1, y, w, h, oldColor, newColor);
    }
    if (x - 1 >= 0) {
      boundaryFill4(canvasCtx, x - 1, y, w, h, oldColor, newColor);
    }
    if (y + 1 < h) {
      boundaryFill4(canvasCtx, x, y + 1, w, h, oldColor, newColor);
    }
    if (y - 1 >= 0) {
      boundaryFill4(canvasCtx, x, y - 1, w, h, oldColor, newColor);
    }
  }
}
/**
 * 扫描线种子填充函数
 * @param canvasCtx 上下文
 * @param imageData 图层数据
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
  layerX: number,
  layerY: number,
  w: number,
  h: number,
  oldColor: string,
  newColor: string
) {
  let stack = []; // 构造种子点栈
  let point = {
    columnIndex: layerX,
    rowIndex: layerY
  }; //1. 种子入栈
  stack.push(point);
  let x, y, xl, xr, yl;
  let ct = 0;
  while (stack.length > 0) {
    const imageData = canvasCtx.getImageData(0, 0, 80, 80);
    const { columnIndex, rowIndex }: any = stack.pop(); //2.取当前种子点
    x = columnIndex;
    y = rowIndex;
    xl = xr = x;
    yl = y;
    const color = calcColor(imageData, columnIndex, rowIndex).rgb;
    // 3.向左右填充（在当前点所在扫描线扫描）
    if (color === oldColor) {
      //填充颜色
      drawGridB(canvasCtx as CanvasRenderingContext2D, {
        columnIndex: x,
        rowIndex: y,
        size: 1,
        color: newColor
      });
      const { x: nxl, y: nyl1 } = Fill(
        canvasCtx,
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
        SearchLineNewSeed(canvasCtx, stack, xl, xr, y - 1, oldColor, newColor);
      }
      if (y + 1 < h) {
        SearchLineNewSeed(canvasCtx, stack, xl, xr, y + 1, oldColor, newColor);
      }
    }
  }
}

function Fill(
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  drFlg: number,
  oldColor: string,
  newColor: string
): any {
  let imageData = canvasCtx.getImageData(0, 0, 80, 80);
  if (drFlg === -1) {
    // x--
    for (; x - 1 >= 0 && calcColor(imageData, x - 1, y).rgb === oldColor; ) {
      --x;
      drawGridB(canvasCtx, {
        columnIndex: x,
        rowIndex: y,
        size: 1,
        color: newColor
      });
      imageData = canvasCtx.getImageData(0, 0, 80, 80);
    }
  } else {
    // x++
    for (; x + 1 < w && calcColor(imageData, x + 1, y).rgb === oldColor; ) {
      ++x;
      drawGridB(canvasCtx, {
        columnIndex: x,
        rowIndex: y,
        size: 1,
        color: newColor
      });
      imageData = canvasCtx.getImageData(0, 0, 80, 80);
    }
  }
  return { x: x, y: y };
}

function SearchLineNewSeed(
  canvasCtx: CanvasRenderingContext2D,
  stack: Array<any>,
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
    let imageData = canvasCtx.getImageData(0, 0, 80, 80);
    // console.log(xt, y, calcColor(imageData, xt, y).rgb);
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
    // 把右边界作为种子加入
    stack.push({
      columnIndex: xRight,
      rowIndex: y
    });
  }
}

export { ScanLineFill, boundaryFill4 };
