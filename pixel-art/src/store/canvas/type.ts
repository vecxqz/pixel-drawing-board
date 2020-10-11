import { page, eventPoint, layer } from "../../../types/canvas";
export interface CanvasState {
  mode: string /**当前画笔模式 */;
  color: string;
  currentPageIndex: number /**当前页数下标 */;
  currentLayerIndex: number /**当前层数下标 */;
  currentRowIndex: number /**当前行下标 */;
  currentColumnIndex: number /**当前列下标 */;
  pages: Array<page> /**画布页存储 */;
  width: number /**画布宽度 */;
  height: number /**画布高度 */;
  tempLayer: layer /**未松开鼠标前的绘制变量 */;
  size: number /**格子边长 */;
  canvasCtx?: CanvasRenderingContext2D /**canvas上下文 */;
  eventPoint: eventPoint /**鼠标事件点 */;
}
