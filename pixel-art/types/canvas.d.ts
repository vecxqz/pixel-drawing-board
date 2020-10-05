export interface cell {
  x: number, /** 横轴坐标*/
  y: number, /** 纵轴坐标 */
  height: number, /** 格子高度*/
  width: number, /** 格子宽度 */
  color: string, /** 格子当前颜色 */
  backgroundColor: string, /** 格子默认背景色 */
}
export interface layer: {
  [key: string]: Array<cell>
}
export interface canvasData {
  title?: string;
  createTtme?: string;
  layer: layer;
}