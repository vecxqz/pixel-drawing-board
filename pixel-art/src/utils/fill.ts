import { drawGridB } from "./canvas";
import { useCanvas } from "../composables/useCanvas";
import Color from "color";
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
  const color = calcColor(imageData, x, y).rgba;
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
function changeColorByImageData(
  imageData: ImageData,
  columnIndex: number,
  rowIndex: number,
  { r, g, b }: { r: number; g: number; b: number }
) {
  const { width, height, data } = imageData;
  let index = 0;
  if (width >= height) {
    index = (columnIndex + rowIndex * width) * 4;
  } else {
    index = (columnIndex * height + rowIndex) * 4;
  }
  data[index] = r; // r
  data[index + 1] = g; // g
  data[index + 2] = b; // b
  data[index + 3] = 255; // a
}
function ScanLineFill(
  canvasCtx: CanvasRenderingContext2D,
  layerX: number,
  layerY: number,
  w: number,
  h: number,
  oldColor: string,
  newColor: string
) {
  // 获取颜色rgb值
  const [r, g, b] = Color(newColor).color;
  let stack = []; // 构造种子点栈
  let point = {
    columnIndex: layerX,
    rowIndex: layerY
  }; //1. 种子入栈
  stack.push(point);
  let x, y, xl, xr, yl;
  let ct = 0;
  const { width, height } = canvasCtx.canvas;
  const imageData = canvasCtx.getImageData(0, 0, width, height);
  // debugger;
  while (stack.length > 0) {
    const { columnIndex, rowIndex }: any = stack.pop(); //2.取当前种子点
    x = columnIndex;
    y = rowIndex;
    xl = xr = x;
    yl = y;
    const color = calcColor(imageData, columnIndex, rowIndex).rgba;
    // 3.向左右填充（在当前点所在扫描线扫描）
    if (color === oldColor) {
      //填充颜色
      // debugger;
      changeColorByImageData(imageData, x, y, { r, g, b });
      const { x: nxl, y: nyl1 } = Fill(
        imageData,
        xl,
        yl,
        w,
        -1,
        oldColor,
        newColor,
        { r, g, b }
      ); // x--方向填充，并返回边界点
      (xl = nxl), (yl = nyl1);
      const { x: nxr, y: nyl2 } = Fill(
        imageData,
        xr,
        yl,
        w,
        1,
        oldColor,
        newColor,
        { r, g, b }
      ); // x++方向填充，并返回边界点
      (xr = nxr), (yl = nyl2);
      // 4.处理相邻两条扫描新线，并获得新种子入栈
      if (y - 1 >= 0) {
        SearchLineNewSeed(imageData, stack, xl, xr, y - 1, oldColor, newColor);
      }
      if (y + 1 < h) {
        SearchLineNewSeed(imageData, stack, xl, xr, y + 1, oldColor, newColor);
      }
    }
  }
  return imageData;
}

function Fill(
  imageData: ImageData,
  x: number,
  y: number,
  w: number,
  drFlg: number,
  oldColor: string,
  newColor: string,
  { r, g, b }: { r: number; g: number; b: number }
): any {
  if (drFlg === -1) {
    // x--
    for (; x - 1 >= 0 && calcColor(imageData, x - 1, y).rgba === oldColor; ) {
      --x;
      changeColorByImageData(imageData, x, y, { r, g, b });
    }
  } else {
    // x++
    for (; x + 1 < w && calcColor(imageData, x + 1, y).rgba === oldColor; ) {
      ++x;
      changeColorByImageData(imageData, x, y, { r, g, b });
    }
  }
  return { x: x, y: y };
}

function SearchLineNewSeed(
  imageData: ImageData,
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
    if (calcColor(imageData, xt, y).rgba === oldColor) {
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
