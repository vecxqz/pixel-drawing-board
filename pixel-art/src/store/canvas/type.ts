import { page, eventPoint, layer, selectArea } from "../../../types/canvas";
export interface CanvasState {
  mode: string /**当前画笔模式 */;
  color: string;
  primaryColor: string;
  secondaryColor: string;
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
  selectCanvasCtx?: CanvasRenderingContext2D /**选择区域 */;
  belowCanvasCtx?: CanvasRenderingContext2D /**当前层之下的层*/;
  backgroundCanvasCtx?: CanvasRenderingContext2D /**背景层 */;
  aboveCanvasCtx?: CanvasRenderingContext2D /**当前层之上的层 */;
  shadowLayerCanvasCtx?: CanvasRenderingContext2D;
  tempCanvasCtx?: CanvasRenderingContext2D;
  eventPoint: eventPoint /**鼠标事件点 */;
  selectArea: selectArea /**选中区域 */;
  previewUrl: string /**预览图片url */;
  redo: Array<any>;
  undo: Array<any>;
}
