import { computed } from "vue";
import { useStore } from "./useStore";
import { useChoose } from "./useChoose";
import { useLayer } from "./useLayer";
import { usePage } from "./usePage";
import cloneDeep from "lodash/cloneDeep";
export function useDoState(this: any) {
  enum TYPE {
    LAYER_DATA_CHANGE = "LAYER_DATA_CHANGE", //只修改了单页单层页面数据
    PAGE_CREATE = "PAGE_CREATE", // 创建页面
    PAGE_DELETE = "PAGE_DELETE", // 删除页面
    PAGE_COPY = "PAGE_COPY", // 复制页面
    PAGE_TO_RIGTH = "PAGE_TO_RIGTH", // 页面右位移,
    PAGE_TO_LEFT = "PAGE_TO_LEFT", // 页面左位移,
    LAYER_RENAME = "LAYER_RENAME", // 层重命名
    LAYER_CREATE = "LAYER_CREATE", // 创建层
    LAYER_DELETE = "LAYER_DELETE", // 删除层
    LAYER_COPY = "LAYER_COPY", // 复制层
    LAYER_UP = "LAYER_UP", // 上移层
    LAYER_DOWN = "LAYER_DOWN", // 下移层
    LAYER_MERGE_UP = "LAYER_MERGE_UP", // 向上合并层
    LAYER_MERGE_DOWN = "LAYER_MERGE_DOWN", // 向下合并层
    LAYER_MERGE_CANCEL = "LAYER_MERGE_CANCEL" // 取消合并图层
  }
  const {
    deleteLayer,
    createLayerByData,
    up,
    down,
    mergeDown,
    mergeUp
  } = useLayer();
  const { chooseLayer } = useChoose();
  const redoStack = computed(() => store.state.canvasModule.redo);
  const undoStack = computed(() => store.state.canvasModule.undo);
  const store: any = useStore();
  const canvasCtx = computed(
    () => store.state.canvasModule.canvasCtx as CanvasRenderingContext2D
  );

  function toRedoStack(redoData: any) {
    store.state.canvasModule.redo.push(redoData);
  }
  function redo() {
    console.log("redo");
    const redoData = store.state.canvasModule.redo.pop();
    if (redoData) {
      const undoData = getFunction(redoData.type)(redoData);
      console.log(undoData);
      toUndoStack(undoData);
    }
  }
  function toUndoStack(undoData: any, clearFlag = false) {
    store.state.canvasModule.undo.push(undoData);
    if (clearFlag) {
      store.state.canvasModule.redo = [];
    }
  }
  function undo() {
    const undoData = store.state.canvasModule.undo.pop();
    if (undoData) {
      const redoData = getFunction(undoData.type)(undoData);
      toRedoStack(redoData);
    }
  }
  function LAYER_DATA_CHANGE(data: any) {
    const {
      currentLayerIndex,
      currentPageIndex,
      layerData,
      layerData: { canvasImageData }
    } = data;
    const previousData = {
      ...data,
      layerData: cloneDeep(
        store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ]
      )
    };
    store.state.canvasModule.currentPageIndex = currentPageIndex;
    store.state.canvasModule.currentLayerIndex = currentLayerIndex;
    store.state.canvasModule.pages[currentPageIndex].layers[
      currentLayerIndex
    ] = layerData;
    canvasCtx.value.putImageData(canvasImageData, 0, 0);
    chooseLayer(currentLayerIndex);
    return previousData;
  }

  function LAYER_RENAME(data: any) {
    const { currentLayerIndex, currentPageIndex, layerName } = data;
    const previousData = {
      ...data,
      layerName: cloneDeep(
        store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ].layerName
      )
    };
    store.state.canvasModule.currentPageIndex = currentPageIndex;
    store.state.canvasModule.currentLayerIndex = currentLayerIndex;
    store.state.canvasModule.pages[currentPageIndex].layers[
      currentLayerIndex
    ].layerName = layerName;
    chooseLayer(currentLayerIndex);
    return previousData;
  }

  function LAYER_CREATE(data: any) {
    const { currentLayerIndex: deleteIndex } = data;
    const {
      currentPageIndex,
      currentLayerIndex,
      currentLayerData
    } = deleteLayer(deleteIndex) as any;
    const previousData = {
      type: TYPE.LAYER_DELETE,
      currentPageIndex,
      currentLayerIndex,
      currentLayerData
    };
    return previousData;
  }

  function LAYER_DELETE(data: any) {
    const { currentPageIndex, currentLayerIndex } = createLayerByData(data);
    const previousData = {
      type: TYPE.LAYER_CREATE,
      currentPageIndex,
      currentLayerIndex
    };
    return previousData;
  }

  function LAYER_UP(data: any) {
    const { currentLayerIndex: downIndex } = data;
    const { currentPageIndex, currentLayerIndex } = down(downIndex) as any;
    const previousData = {
      type: TYPE.LAYER_DOWN,
      currentPageIndex,
      currentLayerIndex
    };
    return previousData;
  }

  function LAYER_DOWN(data: any) {
    const { currentLayerIndex: upIndex } = data;
    const { currentPageIndex, currentLayerIndex } = up(upIndex) as any;
    const previousData = {
      type: TYPE.LAYER_UP,
      currentPageIndex,
      currentLayerIndex
    };
    return previousData;
  }

  function LAYER_COPY(data: any) {
    const { currentLayerIndex: deleteIndex } = data;
    console.log(deleteIndex);
    const {
      currentPageIndex,
      currentLayerIndex,
      currentLayerData
    } = deleteLayer(deleteIndex) as any;
    const previousData = {
      type: TYPE.LAYER_DELETE,
      currentPageIndex,
      currentLayerIndex,
      currentLayerData
    };
    return previousData;
  }
  function LAYER_MERGE_UP(data: any) {
    const { currentLayerData, curretOtherLayerData } = data;
    // console.log(currentLayerData, curretOtherLayerData);
    createLayerByData(curretOtherLayerData);
    createLayerByData(currentLayerData);
    deleteLayer(curretOtherLayerData.currentLayerIndex);
    chooseLayer(currentLayerData.currentLayerIndex);
    const previousData = {
      type: TYPE.LAYER_MERGE_CANCEL,
      currentLayerData,
      curretOtherLayerData
    };
    return previousData;
  }
  function LAYER_MERGE_DOWN(data: any) {
    const { currentLayerData, curretOtherLayerData } = data;
    createLayerByData(currentLayerData);
    createLayerByData(curretOtherLayerData);
    deleteLayer(currentLayerData.currentLayerIndex);
    chooseLayer(currentLayerData.currentLayerIndex);
    const previousData = {
      type: TYPE.LAYER_MERGE_CANCEL,
      currentLayerData,
      curretOtherLayerData
    };
    return previousData;
  }
  function LAYER_MERGE_CANCEL(data: any) {
    const { currentLayerData, curretOtherLayerData } = data;
    let previousData = {};
    let resultData = {};
    let type = "";
    if (
      currentLayerData.currentLayerIndex >
      curretOtherLayerData.currentLayerIndex
    ) {
      resultData = mergeDown(currentLayerData.currentLayerIndex) as any;
      type = TYPE.LAYER_MERGE_DOWN;
    } else {
      resultData = mergeUp(curretOtherLayerData.currentLayerIndex) as any;
      type = TYPE.LAYER_MERGE_UP;
    }
    previousData = {
      type,
      ...resultData
    };
    return previousData;
  }
  function getFunction(TYPE: string) {
    const functionData: { [key: string]: Function } = {
      LAYER_DATA_CHANGE: LAYER_DATA_CHANGE,
      LAYER_RENAME: LAYER_RENAME,
      LAYER_CREATE: LAYER_CREATE,
      LAYER_DELETE: LAYER_DELETE,
      LAYER_UP: LAYER_UP,
      LAYER_DOWN: LAYER_DOWN,
      LAYER_COPY: LAYER_COPY,
      LAYER_MERGE_UP: LAYER_MERGE_UP,
      LAYER_MERGE_DOWN: LAYER_MERGE_DOWN,
      LAYER_MERGE_CANCEL: LAYER_MERGE_CANCEL
    };
    return functionData[TYPE];
  }
  return { toRedoStack, toUndoStack, redo, undo, TYPE };
}
