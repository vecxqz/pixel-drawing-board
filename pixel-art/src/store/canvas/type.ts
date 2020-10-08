import { page } from "../../../types/canvas";
export interface CanvasState {
  mode: string /**当前画笔模式 */;
  currentPageIndex: number /**当前页数下标 */;
  currentLayerIndex: number /**当前层数下标 */;
  pages: Array<page> /**画布页存储 */;
  width: number /**画布宽度 */;
  height: number /**画布高度 */;
}
