import { computed, ref, nextTick } from "vue";
import { useStore } from "./useStore";
import { userPreview } from "./userPreview";
import clone from "lodash/clone";
export function useLayer() {
  const store: any = useStore();
  const { setCanvasPreviewByImageData } = userPreview();
  const renameIndex = ref(-1);
  const renameElement = ref(null);
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
    const index =
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers.length;
    store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers.push({
      layerName: `layer${index}`,
      key: `${index}`,
      canvaImageData: undefined
    });
    choose(index);
  }
  function choose(index: number) {
    const {
      width,
      height,
      currentPageIndex,
      currentLayerIndex
    } = store.state.canvasModule;
    store.state.canvasModule.pages[currentPageIndex].layers[
      currentLayerIndex
    ].canvaImageData = canvasCtx.value.getImageData(0, 0, width, height);
    canvasCtx.value.clearRect(0, 0, width, height);
    belowCanvasCtx.value.clearRect(0, 0, width, height);
    aboveCanvasCtx.value.clearRect(0, 0, width, height);
    store.state.canvasModule.currentLayerIndex = index;
    // 下标大于当前index的放到上层，下标小于当前inex的放到下层
    for (let i = 0; i < layers.value.length; i++) {
      const layer = layers.value[i];
      const { canvaImageData, layerName } = layer;
      if (i < index) {
        console.log(`${layerName} 合到下层`);
        tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        belowCanvasCtx.value.drawImage(canvas, 0, 0);
      }
      if (i === index) {
        // 说明下层数据已合并完，清除临时层的画布内容，绘制上层数据
        // 如果该层存在数据，则把该层数据绘制到canvas上
        tempCanvasCtx.value.clearRect(0, 0, width, height);
        if (canvaImageData) {
          canvasCtx.value.putImageData(canvaImageData, 0, 0);
          // console.log(canvasCtx.value.canvas.toDataURL("image/png"));
        }
      }
      if (i > index) {
        console.log(`${layerName} 合到上层`);
        tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        // console.log(canvas.toDataURL("image/png"));
        aboveCanvasCtx.value.drawImage(canvas, 0, 0);
      }
    }
    tempCanvasCtx.value.clearRect(0, 0, width, height);
  }
  function up(index: number) {
    if (currentLayerIndex.value !== layers.value.length - 1) {
      const { currentPageIndex } = store.state.canvasModule;
      const { canvaImageData } = store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index + 1];
      canvasCtx.value.putImageData(canvaImageData, 0, 0);
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
      choose(index + 1);
      setPreview();
    }
  }
  function down(index: number) {
    if (currentLayerIndex.value !== 0) {
      // 此处先把要交换的下层canvas imagedata取出，并绘制到当前画布
      // 不这么做的话在下面进行数据交换之后，在choose函数内，执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvaImageData = canvasCtx.value.getImageData(0, 0, width, height);会导致数据异常
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
      // 执行choose(0)
      // 这时的currentLayerIndex还是1
      // 执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvaImageData = canvasCtx.value.getImageData(0, 0, width, height);
      // 后，当前index是 1, 所以
      // |index| layer| 绘制图像 |
      // |0    |  1   |  1      |
      // |1    |  0   |  0 ->  1|
      // 修复
      // 会导致绘制异常,所以在交换两层数据之前，手动把要被交换的那一层的数据先绘制到当前画布
      // const { currentPageIndex } = store.state.canvasModule;
      // const { canvaImageData } = store.state.canvasModule.pages[
      //   currentPageIndex
      // ].layers[index - 1];
      // canvasCtx.value.putImageData(canvaImageData, 0, 0);
      //  当前index是 1 ,canvasCtx里的图像 1->0
      // |index| layer| 绘制图像|
      // |1    |  1   |  1     |
      // |0    |  1   |  0     |
      // 执行choose(0)
      // 这时的currentLayerIndex还是1
      // 执行
      // store.state.canvasModule.pages[currentPageIndex].layers[
      //   currentLayerIndex
      // ].canvaImageData = canvasCtx.value.getImageData(0, 0, width, height);
      // 后，当前index是 1, canvasCtx里的图像是0 所以
      // |index| layer| 绘制图像 |
      // |0    |  1   |  1      |
      // |1    |  0   |  0 ->  0|
      // 数据就对了
      const { currentPageIndex } = store.state.canvasModule;
      const { canvaImageData } = store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index - 1];
      canvasCtx.value.putImageData(canvaImageData, 0, 0);
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
      choose(index - 1);
      setPreview();
    }
  }
  function deleteLayer(index: number) {
    const { currentPageIndex } = store.state.canvasModule;
    const length =
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers.length;
    if (length === 1) {
      return;
    }
    store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers.splice(index, 1);
    const newLength =
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers.length;
    if (index !== 0) {
      if (newLength === 1) {
        const { canvaImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[0];
        canvasCtx.value.putImageData(canvaImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = 0;
        choose(0);
      } else {
        const { canvaImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index - 1];
        canvasCtx.value.putImageData(canvaImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = index - 1;
        choose(index - 1);
      }
    } else {
      if (newLength === 1) {
        const { canvaImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[0];
        canvasCtx.value.putImageData(canvaImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = 0;
        choose(0);
      } else {
        const { canvaImageData } = store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index + 1];
        canvasCtx.value.putImageData(canvaImageData, 0, 0);
        store.state.canvasModule.currentLayerIndex = index + 1;
        choose(index + 1);
      }
    }
    setPreview();
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
    ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
    const { canvaImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index];
    const { canvaImageData: upImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index + 1];
    canvasCtx.clearRect(0, 0, width, height);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(upImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    store.state.canvasModule.pages[currentPageIndex].layers[
      index + 1
    ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
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
    ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
    const { canvaImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index];
    const { canvaImageData: downImageData } = store.state.canvasModule.pages[
      currentPageIndex
    ].layers[index - 1];
    canvasCtx.clearRect(0, 0, width, height);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(downImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
    canvasCtx.drawImage(tempCanvasCtx.value.canvas, 0, 0);
    store.state.canvasModule.pages[currentPageIndex].layers[
      index - 1
    ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
    deleteLayer(index);
  }
  function copy(index: number) {
    const { currentPageIndex, width, height } = store.state.canvasModule;
    let newLayerData = clone(
      store.state.canvasModule.pages[currentPageIndex].layers[index]
    );
    newLayerData.key = `${newLayerData.key}_copy_${Math.random() * 100}`;
    newLayerData.layerName = `${newLayerData.layerName}_copy`;
    newLayerData.canvaImageData = canvasCtx.value.getImageData(
      0,
      0,
      width,
      height
    );
    store.state.canvasModule.pages[currentPageIndex].layers[
      index
    ].canvaImageData = canvasCtx.value.getImageData(0, 0, width, height);
    store.state.canvasModule.pages[currentPageIndex].layers.push(newLayerData);
  }
  function rename(index: number) {
    console.log("rename", index);
    renameIndex.value = index;
    nextTick(() => {
      if (renameElement.value) {
        (renameElement.value as any).focus();
      }
    });
  }
  function blurInput() {
    if (renameElement.value) {
      (renameElement.value as any).blur();
    }
  }
  function renameSuccess() {
    renameIndex.value = -1;
  }
  function setPreview() {
    const { width, height } = store.state.canvasModule;
    const backgroundMeta = {
      layerName: "background",
      canvaImageData: backgroundCanvasCtx.value.getImageData(
        0,
        0,
        width,
        height
      )
    };
    const belowMeta = {
      layerName: "below",
      canvaImageData: belowCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const aboveMeta = {
      layerName: "above",
      canvaImageData: aboveCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const currentMeta = {
      layerName: "current",
      canvaImageData: canvasCtx.value.getImageData(0, 0, width, height)
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
    rename,
    copy,
    mergeUp,
    mergeDown,
    deleteLayer,
    renameIndex,
    layerReverse,
    currentLayerIndex,
    renameSuccess,
    blurInput,
    renameElement,
    currentLayer,
    choose
  };
}
