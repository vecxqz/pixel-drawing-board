import { computed } from "vue";
import { useStore } from "./useStore";

export function useDoState(this: any) {
  enum TYPE {
    LAYER_DATA_CHANGE = "LAYER_DATA_CHANGE", //只修改了单页单层页面数据
    PAGE_CREATE = "PAGE_CREATE", // 创建页面
    PAGE_DELETE = "PAGE_DELETE", // 删除页面
    PAGE_COPY = "PAGE_COPY", // 复制页面
    PAGE_TO_RIGTH = "PAGE_TO_RIGTH", // 页面右位移,
    PAGE_TO_LEFT = "PAGE_TO_LEFT", // 页面左位移,
    LAYER_CREATE = "LAYER_CREATE", // 创建层
    LAYER_DELETE = "LAYER_DELETE", // 删除层
    LAYER_COPY = "LAYER_COPY", // 复制层
    LAYER_UP = "LAYER_UP", // 上移层
    LAYER_DOWN = "LAYER_DOWN", // 下移层
    LAYER_MERGE_UP = "LAYER_MERGE_UP", // 向上合并层
    LAYER_MERGE_DOWN = "LAYER_MERGE_DOWN" // 向下合并层
  }
  const redoStack = computed(() => store.state.canvasModule.redo);
  const undoStack = computed(() => store.state.canvasModule.undo);
  const store: any = useStore();

  function toRedoStack(redoData: any) {
    store.state.canvasModule.redo.push(redoData);
  }
  function redo() {
    const redoData = store.state.canvasModule.redo.shift();
    toUndoStack(redoData);
  }
  function toUndoStack(undoData: any) {
    store.state.canvasModule.undo.push(undoData);
  }
  function undo() {
    const unedoData = store.state.canvasModule.undo.shift();
    toRedoStack(unedoData);
  }
  return { toRedoStack, redo, undo, TYPE };
}
