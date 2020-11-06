import { computed, ref, nextTick } from "vue";
import { useStore } from "./useStore";
import { userPreview } from "./userPreview";
import { useChoose } from "./useChoose";

import clone from "lodash/clone";
export function useLayer() {
  const store: any = useStore();
  const { setCanvasPreviewByImageData } = userPreview();
  const { chooseLayer } = useChoose();
  const layers = computed(() => {
    if (
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
    ) {
      return store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers;
    }
    return [];
  });
  const layerReverse = computed(() => [...layers.value].reverse());
  const currentLayerIndex = computed(
    () => store.state.canvasModule.currentLayerIndex
  );
  const currentLayer = computed(() => {
    const { currentPageIndex, currentLayerIndex } = store.state.canvasModule;
    const page = store.state.canvasModule.pages[currentPageIndex];
    if (page) {
      return store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ];
    }
    return [];
  });
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const backgroundCanvasCtx = computed(
    () =>
      store.state.canvasModule.backgroundCanvasCtx as CanvasRenderingContext2D
  );
  const shadowCanvasCtx = computed(
    () =>
      store.state.canvasModule.shadowLayerCanvasCtx as CanvasRenderingContext2D
  );
  const tempCanvasCtx = computed(
    () => store.state.canvasModule.tempCanvasCtx as CanvasRenderingContext2D
  );
  const belowCanvasCtx = computed(
    () => store.state.canvasModule.belowCanvasCtx as CanvasRenderingContext2D
  );
  const aboveCanvasCtx = computed(
    () => store.state.canvasModule.aboveCanvasCtx as CanvasRenderingContext2D
  );

  function create() {
    const { currentPageIndex } = store.state.canvasModule;
    const index =
      store.state.canvasModule.pages[currentPageIndex].layers.length;
    store.state.canvasModule.pages[currentPageIndex].layers.push({
      layerName: `layer${index}`,
      key: `${index}`,
      canvasImageData: undefined
    });
    chooseLayer(index);
    return { currentPageIndex, currentLayerIndex: index };
  }
  function createLayerByData(data: any) {
    const { currentPageIndex, currentLayerIndex, deleteData } = data;
    store.state.canvasModule.pages[currentPageIndex].layers.length;
    store.state.canvasModule.pages[currentPageIndex].layers.splice(
      currentLayerIndex,
      0,
      deleteData
    );
    chooseLayer(currentLayerIndex);
    return {
      currentPageIndex,
      currentLayerIndex
    };
  }
  function up(index: number) {
    if (currentLayerIndex.value !== layers.value.length - 1) {
      const { currentPageIndex } = store.state.canvasModule;
      const { canvasImageData } = store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index + 1];
      canvasCtx.value.putImageData(canvasImageData, 0, 0);
      const temp =
        store.state.canvasModule.pages[
          store.state.canvasModule.currentPageIndex
        ].layers[index];
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[index] =
        store.state.canvasModule.pages[
          store.state.canvasModule.currentPageIndex
        ].layers[index + 1];
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[index + 1] = temp;
      chooseLayer(index + 1);
      setPreview();
      return {
        currentPageIndex,
        currentLayerIndex: index + 1
      };
    }
  }
  function down(index: number) {
    if (currentLayerIndex.value !== 0) {
      // 此处先把要交换的下层canvas imagedata取出，并绘制到当前画布
      // 不这么做的话在下面进行数据交换之后，在choose函数内，执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvasImageData = canvasCtx.value.getImageData(0, 0, width, height);会导致数据异常
      // 实际上，是把当前的画布信息写入了 被交换前的下层canvas imagedata中
      // 举例 执行down(1)
      //  当前index 1 ,canvasCtx里的图像是1
      // |index| layer| 绘制图像|
      // |1    |  1   |  1     |
      // |0    |  0   |  0     |
      // 将layer 1 下移到layer 0
      //  当前index是 1 ,canvasCtx里的图像是0
      // |index| layer| 绘制图像|
      // |1    |  1   |  1     |
      // |0    |  1   |  0     |
      // 执行chooseLayer(0)
      // 这时的currentLayerIndex还是1
      // 执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvasImageData = canvasCtx.value.getImageData(0, 0, width, height);
      // 后，当前index是 1, 所以
      // |index| layer| 绘制图像 |
      // |0    |  1   |  1      |
      // |1    |  0   |  0 ->  1|
      // 修复
      // 会导致绘制异常,所以在交换两层数据之前，手动把要被交换的那一层的数据先绘制到当前画布
      // const { currentPageIndex } = store.state.canvasModule;
      // const { canvasImageData } = store.state.canvasModule.pages[
      //   currentPageIndex
      // ].layers[index - 1];
      // canvasCtx.value.putImageData(canvasImageData, 0, 0);
      //  当前index是 1 ,canvasCtx里的图像 1->0
      // |index| layer| 绘制图像|
      // |1    |  1   |  1     |
      // |0    |  1   |  0     |
      // 执行chooseLayer(0)
      // 这时的currentLayerIndex还是1
      // 执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvasImageData = canvasCtx.value.getImageData(0, 0, width, height);
      // 后，当前index是 1, canvasCtx里的图像是0 所以
      // |index| layer| 绘制图像 |
      // |0    |  1   |  1      |
      // |1    |  0   |  0 ->  0|
      // 数据就对了
      const { currentPageIndex } = store.state.canvasModule;
      const { canvasImageData } = store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index - 1];
      canvasCtx.value.putImageData(canvasImageData, 0, 0);
      const temp =
        store.state.canvasModule.pages[
          store.state.canvasModule.currentPageIndex
        ].layers[index];
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[index] =
        store.state.canvasModule.pages[
          store.state.canvasModule.currentPageIndex
        ].layers[index - 1];
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[index - 1] = temp;
      chooseLayer(index - 1);
      setPreview();
      return {
        currentPageIndex,
        currentLayerIndex: index - 1
      };
    }
  }
  function deleteLayer(index: number) {
    const { currentPageIndex } = store.state.canvasModule;
    const length =
      store.state.canvasModule.pages[currentPageIndex].layers.length;
    if (length === 1) {
      return;
    }
    const deleteData = {
      currentPageIndex: currentPageIndex,
      currentLayerIndex: index,
      deleteData: store.state.canvasModule.pages[currentPageIndex].layers[index]
    };
    store.state.canvasModule.pages[currentPageIndex].layers.splice(index, 1);
    const newLength =
      store.state.canvasModule.pages[currentPageIndex].layers.length;
    if (index !== 0) {
      if (newLength === 1) {
        const { canvasImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[0];
        canvasCtx.value.putImageData(canvasImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = 0;
        chooseLayer(0);
      } else {
        const { canvasImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index - 1];
        canvasCtx.value.putImageData(canvasImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = index - 1;
        chooseLayer(index - 1);
      }
    } else {
      if (newLength === 1) {
        const { canvasImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[0];
        canvasCtx.value.putImageData(canvasImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = 0;
        chooseLayer(0);
      } else {
        const { canvasImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index + 1];
        canvasCtx.value.putImageData(canvasImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = index + 1;
        chooseLayer(index + 1);
      }
    }
    setPreview();
    return deleteData;
  }
  function mergeUp(index: number) {
    if (index === layers.value.length - 1) {
      return;
    }
    const {
      width,
      height,
      currentPageIndex,
      canvasCtx
    } = store.state.canvasModule;
    store.state.canvasModule.pages[currentPageIndex].layers[
      index
    ].canvasImageData = canvasCtx.getImageData(0, 0, width, height);
    const { canvasImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index];
    const { canvasImageData: upImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index + 1];
    canvasCtx.clearRect(0, 0, width, height);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(upImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(canvasImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    store.state.canvasModule.pages[currentPageIndex].layers[
      index + 1
    ].canvasImageData = canvasCtx.getImageData(0, 0, width, height);
    deleteLayer(index);
  }
  function mergeDown(index: number) {
    if (index === 0) {
      return;
    }
    const {
      width,
      height,
      currentPageIndex,
      canvasCtx
    } = store.state.canvasModule;
    store.state.canvasModule.pages[currentPageIndex].layers[
      index
    ].canvasImageData = canvasCtx.getImageData(0, 0, width, height);
    const { canvasImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index];
    const { canvasImageData: downImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index - 1];
    canvasCtx.clearRect(0, 0, width, height);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(downImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(canvasImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    store.state.canvasModule.pages[currentPageIndex].layers[
      index - 1
    ].canvasImageData = canvasCtx.getImageData(0, 0, width, height);
    deleteLayer(index);
  }
  function copy(index: number) {
    const { currentPageIndex, width, height } = store.state.canvasModule;
    let newLayerData = clone(
      store.state.canvasModule.pages[currentPageIndex].layers[index]
    );
    newLayerData.key = `${newLayerData.key}_copy_${Math.random() * 100}`;
    newLayerData.layerName = `${newLayerData.layerName}_copy`;
    newLayerData.canvasImageData = canvasCtx.value.getImageData(
      0,
      0,
      width,
      height
    );
    store.state.canvasModule.pages[currentPageIndex].layers[
      index
    ].canvasImageData = canvasCtx.value.getImageData(0, 0, width, height);
    store.state.canvasModule.pages[currentPageIndex].layers.splice(
      index + 1,
      0,
      newLayerData
    );
    chooseLayer(index + 1);
    return {
      currentPageIndex,
      currentLayerIndex: index + 1
    };
  }

  function setPreview() {
    const { width, height } = store.state.canvasModule;
    const backgroundMeta = {
      layerName: "background",
      canvasImageData: backgroundCanvasCtx.value.getImageData(
        0,
        0,
        width,
        height
      )
    };
    const belowMeta = {
      layerName: "below",
      canvasImageData: belowCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const aboveMeta = {
      layerName: "above",
      canvasImageData: aboveCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const currentMeta = {
      layerName: "current",
      canvasImageData: canvasCtx.value.getImageData(0, 0, width, height)
    };
    const canvasArray = [backgroundMeta, belowMeta, currentMeta, aboveMeta];
    setCanvasPreviewByImageData(
      canvasArray,
      tempCanvasCtx.value,
      shadowCanvasCtx.value
    );
  }
  return {
    create,
    up,
    down,
    copy,
    mergeUp,
    mergeDown,
    deleteLayer,
    layerReverse,
    currentLayerIndex,
    currentLayer,
    chooseLayer,
    createLayerByData
  };
}
