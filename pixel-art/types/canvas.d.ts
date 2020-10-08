export interface cell {
  columnIndex: number,/**横轴下标 */
  rowIndex: number,/**纵轴下标 */
  x: number, /** 横轴坐标*/
  y: number, /** 纵轴坐标 */
  height?: number, /** 格子高度*/
  width?: number, /** 格子宽度 */
  size: number, /** 格子边长 */
  color?: string, /** 格子当前颜色 */
  backgroundColor: string, /** 格子默认背景色 */
}
}

export interface layer {
  [index:number]: Array<cell> /** 存储格子数据 */;
}
/** 单页数据类型*/
export interface page {
  layers:Array<layer>
}
export interface canvasData {
  title?: string;
  createTtme?: string;
  layer: layer;
}