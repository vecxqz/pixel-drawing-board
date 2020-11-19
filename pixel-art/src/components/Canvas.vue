<template>
  <div
    id="canvas"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    v-loading.fullscreen.lock="loadingFin"
  >
    <div
      id="canvas-container"
      class="pos-relative"
      :style="
        `width:${canvasMeta.width * scale}px;
        height:${canvasMeta.height * scale}px`
      "
    >
      <canvas
        class="pos-absoulte pe-none layer-select"
        ref="selectcanvas"
        :width="selectArea.diffX"
        :height="selectArea.diffY"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-background"
        ref="backgroundCanvas"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-below"
        ref="belowCanvas"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte layer-main"
        ref="canvas"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-above"
        ref="aboveCanvas"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow"
        ref="layerShandowCanvas"
        style="visibility: hidden"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-temp"
        ref="tempCanvas"
        style="visibility: hidden"
        :width="store.state.canvasModule.width"
        :height="store.state.canvasModule.height"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useColor } from "../composables/useColor";
import { usePencil } from "../composables/usePencil";
import { useMirrorPencil } from "../composables/useMirrorPencil";
import { useBucket } from "../composables/useBucket";
import { useLine } from "../composables/useLine";
import { useSquare } from "../composables/useSquare";
import { useColorPicker } from "../composables/useColorPicker";
import { useCircle } from "../composables/useCircle";
import { useEraser } from "../composables/useEraser";
import { useSelect } from "../composables/useSelect";
import { useMousePosition } from "../composables/usePosition";
import { userPreview } from "../composables/userPreview";
import { useMove } from "../composables/useMove";
import { useDoState } from "../composables/useDoState";
import { usePage } from "../composables/usePage";
import { isUndefined } from "../utils/common";
import { useFile } from "../composables/useFile";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, throttleTime } from "rxjs/operators";
import { useStore } from "../composables/useStore";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useCanvas } from "../composables/useCanvas";
export default {
  name: "Canvas",
  setup() {
    const store: any = useStore();
    const { parseBackground } = useCanvas();
    const {
      mouseDown: pencilMouseDown,
      mouseMove: pencilMouseMove,
      mouseUp: pencilMouseUp
    } = usePencil();
    const {
      mouseDown: mirrorPencilMouseDown,
      mouseMove: mirrorPencilMouseMove,
      mouseUp: mirrorPencilMouseUp
    } = useMirrorPencil();
    const {
      mouseDown: bucketMouseDown,
      mouseMove: bucketMouseMove,
      mouseUp: bucketMouseUp
    } = useBucket();
    const {
      mouseDown: lineMouseDown,
      mouseMove: lineMouseMove,
      mouseUp: lineMouseUp
    } = useLine();
    const {
      mouseDown: squareMouseDown,
      mouseMove: squareMouseMove,
      mouseUp: squareMouseUp
    } = useSquare();
    const {
      mouseDown: colorPickerMouseDown,
      mouseMove: colorPickerMouseMove,
      mouseUp: colorPickerMouseUp
    } = useColorPicker();
    const {
      mouseDown: circleMouseDown,
      mouseMove: circleMouseMove,
      mouseUp: circleMouseUp
    } = useCircle();
    const {
      mouseDown: eraserMouseDown,
      mouseMove: eraserMouseMove,
      mouseUp: eraserMouseUp
    } = useEraser();
    const {
      mouseDown: selectMouseDown,
      mouseMove: selectMouseMove,
      mouseUp: selectMouseUp,
      selectArea: selectArea,
      cancelSelect
    } = useSelect();
    const {
      mouseDown: recordMouseDownPosition,
      mouseMove: recordMouseMovePosition
      // mouseUp: recordMouseUpPosition
    } = useMousePosition();
    const {
      mouseDown: moveMouseDown,
      mouseMove: moveMouseMove,
      mouseUp: moveMouseUp
    } = useMove();
    const route = useRoute();
    const { setCurrentColor } = useColor();
    const { setCanvasPreviewByImageData, setPageImageData } = userPreview();
    const { toUndoStack, TYPE, redo, undo } = useDoState();
    const { choose: choosePage } = usePage();
    const { loadLocal, loadServer, setCanvasSizeData } = useFile();
    const canvas = ref(undefined);
    const selectcanvas = ref(undefined);
    const layerShandowCanvas = ref(undefined);
    const backgroundCanvas = ref(undefined);
    const aboveCanvas = ref(undefined);
    const belowCanvas = ref(undefined);
    const tempCanvas = ref(undefined);
    const imageData = ref(undefined);
    const loadingFin = ref(true);
    const loadingText = ref("正在创建工程，请稍等");
    // const isboundary = ref(false);
    const boundaryMeta = reactive({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    });
    const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
    const backgroundCanvasCtx = computed(
      () => store.state.canvasModule.backgroundCanvasCtx
    );
    const shadowCanvasCtx = computed(
      () => store.state.canvasModule.shadowLayerCanvasCtx
    );
    const tempCanvasCtx = computed(
      () => store.state.canvasModule.tempCanvasCtx
    );
    const belowCanvasCtx = computed(
      () => store.state.canvasModule.belowCanvasCtx
    );
    const aboveCanvasCtx = computed(
      () => store.state.canvasModule.aboveCanvasCtx
    );
    const canvasMeta = computed(() => ({
      width: store.state.canvasModule.canvasMetaWidth,
      height: store.state.canvasModule.canvasMetaHeight
    }));
    const scale = computed(() => store.state.canvasModule.scale);
    watch(
      () => store.state.canvasModule.mode,
      (newVal, oldVal) => {
        if (oldVal === "select" && oldVal !== newVal) {
          cancelSelect();
          mergeCanvas();
        }
      }
    );
    onMounted(async () => {
      // 屏蔽右键菜单
      window.oncontextmenu = function(e: MouseEvent) {
        e.preventDefault();
      };
      const pages = JSON.parse(localStorage.getItem("pages") as string);
      const { params } = route;
      const { id: guid } = params;
      const canvasContainer: HTMLElement = window.document.getElementById(
        "canvas-container"
      ) as HTMLElement;
      store.dispatch("canvasModule/SET_CANVASCTX", canvas.value);
      store.dispatch(
        "canvasModule/SET_BACKGROUND_CANVAS_CANVASCTX",
        backgroundCanvas.value
      );
      store.dispatch(
        "canvasModule/SET_SHDOW_LAYER_CANVASCTX",
        layerShandowCanvas.value
      );
      store.dispatch("canvasModule/SET_SELECT_CANVASCTX", selectcanvas.value);
      store.dispatch("canvasModule/SET_ABOVE_CANVASCTX", aboveCanvas.value);
      store.dispatch("canvasModule/SET_BELOW_CANVASCTX", belowCanvas.value);
      store.dispatch("canvasModule/SET_TEMP_LAYER_CANVASCTX", tempCanvas.value);
      // 根据有没有本地数据判断是新建工程还是读取本地工程
      if (guid) {
        await loadServer();
        loadingText.value = "正在读取工程文件，请稍等";
      } else {
        if (pages === null) {
          store.dispatch("canvasModule/CREATE_PAGE");
        } else {
          loadLocal();
        }
      }
      parseBackground(backgroundCanvasCtx.value);
      setCanvasSizeData();
      const { currentPageIndex } = store.state.canvasModule;
      choosePage(currentPageIndex);
      nextTick(() => {
        mergeCanvas();
      });

      const document = window.document.body;
      fromEvent(document, "keydown").subscribe((e: any) => {
        if (e.target.tagName !== "INPUT") {
          const { code, ctrlKey } = e as KeyboardEvent;
          if (code === "KeyZ" && ctrlKey) {
            undo();
            e.preventDefault();
          }
          if (code === "KeyY" && ctrlKey) {
            redo();
            e.preventDefault();
          }
        }
      });
      const mouseDown = fromEvent(canvasContainer, "mousedown");
      const mouseMove = fromEvent(canvasContainer, "mousemove");
      const mouseUp = fromEvent(document, "mouseup");
      const mouseWheel = fromEvent(canvasContainer, "mousewheel");
      mouseWheel.pipe().subscribe((e: any) => {
        const { deltaY } = e;
        if (deltaY > 0 && store.state.canvasModule.scale > 1) {
          store.state.canvasModule.scale = store.state.canvasModule.scale / 2;
          store.state.canvasModule.size = store.state.canvasModule.size / 2;
        }
        if (deltaY < 0 && store.state.canvasModule.scale < 8) {
          store.state.canvasModule.scale = store.state.canvasModule.scale * 2;
          store.state.canvasModule.size = store.state.canvasModule.size * 2;
        }
        e.preventDefault();
      });
      mouseDown
        .pipe(
          tap(e => {
            handleMouseDown(e as MouseEvent);
          }),
          // mouseDown事件转化为mouseMove事件
          map(() =>
            mouseMove.pipe(
              // mouseUp后结束事件
              takeUntil(
                mouseUp.pipe(
                  tap(e => {
                    console.log("mouseUp");
                    handleMouseUp(e as MouseEvent);
                  })
                )
              )
            )
          ),
          throttleTime(0, animationFrameScheduler),
          // 拍平
          concatAll()
        )
        .subscribe(e => {
          handleMouseMove(e as MouseEvent);
        });

      loadingFin.value = false;
    });

    function mergeCanvas() {
      const { width, height } = store.state.canvasModule;
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers[
        store.state.canvasModule.currentLayerIndex
      ].imageData = canvasCtx.value.getImageData(0, 0, width, height);
      const backgroundMeta = {
        layerName: "background",
        imageData: backgroundCanvasCtx.value.getImageData(0, 0, width, height)
      };
      const belowMeta = {
        layerName: "below",
        imageData: belowCanvasCtx.value.getImageData(0, 0, width, height)
      };
      const aboveMeta = {
        layerName: "above",
        imageData: aboveCanvasCtx.value.getImageData(0, 0, width, height)
      };
      const currentMeta = {
        layerName: "current",
        imageData: canvasCtx.value.getImageData(0, 0, width, height)
      };
      const canvasArray = [backgroundMeta, belowMeta, currentMeta, aboveMeta];
      const pageImageArray = [belowMeta, currentMeta, aboveMeta];
      tempCanvasCtx.value.drawImage(belowCanvasCtx.value.canvas, 0, 0);
      tempCanvasCtx.value.drawImage(canvasCtx.value.canvas, 0, 0);
      tempCanvasCtx.value.drawImage(aboveCanvasCtx.value.canvas, 0, 0);
      store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].imageData = tempCanvasCtx.value.getImageData(0, 0, width, height);
      setCanvasPreviewByImageData(
        canvasArray,
        tempCanvasCtx.value,
        shadowCanvasCtx.value
      );
      setPageImageData(
        pageImageArray,
        tempCanvasCtx.value,
        shadowCanvasCtx.value
      );
    }
    function handleMouseMove(e: MouseEvent) {
      const { mode } = store.state.canvasModule;
      let columnIndex = Math.floor(e.offsetX / store.state.canvasModule.size),
        rowIndex = Math.floor(e.offsetY / store.state.canvasModule.size);
      recordMouseMovePosition(e);
      // console.log(columnIndex, rowIndex);
      store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      if (mode === "pencil") {
        pencilMouseMove(e);
      }
      if (mode === "line") {
        imageDataSave();
        imageDataUse();
        lineMouseMove(e);
      }
      if (mode === "eraser") {
        eraserMouseMove(e);
      }
      if (mode === "bucket") {
        bucketMouseMove();
      }
      if (mode === "square") {
        imageDataSave();
        imageDataUse();
        squareMouseMove(e);
      }
      if (mode === "colorPicker") {
        colorPickerMouseMove(e);
      }
      if (mode === "circle") {
        imageDataSave();
        imageDataUse();
        circleMouseMove(e);
      }
      if (mode === "select") {
        imageDataSave();
        imageDataUse();
        selectMouseMove(e);
      }
      if (mode === "mirrorPencil") {
        mirrorPencilMouseMove(e);
      }
      if (mode === "move") {
        moveMouseMove(e);
      }
    }
    function imageDataSave() {
      // console.log("imageDataSave");
      const { width, height } = store.state.canvasModule;
      // 存储在进行绘制之前的画布数据
      if (isUndefined(imageData.value)) {
        imageData.value = canvasCtx.value.getImageData(0, 0, width, height);
      }
    }
    function imageDataUse() {
      // console.log("imageDataUse");
      if (!isUndefined(imageData.value)) {
        canvasCtx.value.putImageData(imageData.value, 0, 0);
      }
    }
    function imageDataSaveClean() {
      imageData.value = undefined;
    }
    function handleMouseDown(e: MouseEvent) {
      const {
        currentPageIndex,
        currentLayerIndex,
        width: layerWidth,
        height: layerHeight
      } = store.state.canvasModule;
      const canvasContainer: HTMLElement = window.document.getElementById(
        "canvas-container"
      ) as HTMLElement;
      const {
        width,
        left,
        height,
        top
      } = canvasContainer.getBoundingClientRect();
      boundaryMeta.startX = left;
      boundaryMeta.endX = left + width;
      boundaryMeta.startY = left;
      boundaryMeta.endY = top + height;
      const { mode } = store.state.canvasModule;
      setCurrentColor(e);
      recordMouseDownPosition(e);
      if (mode !== "select") {
        toUndoStack(
          {
            currentLayerIndex,
            currentPageIndex,
            layerData: {
              ...store.state.canvasModule.pages[currentPageIndex].layers[
                currentLayerIndex
              ],
              imageData: canvasCtx.value.getImageData(
                0,
                0,
                layerWidth,
                layerHeight
              )
            },
            type: TYPE.LAYER_DATA_CHANGE
          },
          true
        );
      }
      if (mode === "pencil") {
        pencilMouseDown(e);
      }
      if (mode === "line") {
        lineMouseDown(e);
      }
      if (mode === "bucket") {
        bucketMouseDown(e);
      }
      if (mode === "square") {
        squareMouseDown(e);
      }
      if (mode === "colorPicker") {
        colorPickerMouseDown(e);
      }
      if (mode === "circle") {
        circleMouseDown(e);
      }
      if (mode === "eraser") {
        eraserMouseDown(e);
      }
      if (mode === "select") {
        const prevImageData = selectMouseDown(e);
        if (prevImageData) {
          toUndoStack(
            {
              currentLayerIndex,
              currentPageIndex,
              layerData: {
                ...store.state.canvasModule.pages[currentPageIndex].layers[
                  currentLayerIndex
                ],
                imageData: prevImageData
                // imageData: canvasCtx.value.getImageData(
                //   0,
                //   0,
                //   layerWidth,
                //   layerHeight
                // )
              },
              type: TYPE.LAYER_DATA_CHANGE
            },
            true
          );
        }
      }
      if (mode === "mirrorPencil") {
        mirrorPencilMouseDown(e);
      }
      if (mode === "move") {
        moveMouseDown(e);
      }
    }
    function handleMouseUp(e: MouseEvent) {
      const { clientX, clientY } = e;
      const { mode, size } = store.state.canvasModule;
      if (
        clientX > boundaryMeta.startX &&
        clientX < boundaryMeta.endX &&
        clientY > boundaryMeta.startY &&
        clientY < boundaryMeta.endY
      ) {
        store.dispatch("canvasModule/SET_END_POINT", { e });
        let columnIndex = Math.floor(e.offsetX / size),
          rowIndex = Math.floor(e.offsetY / size);
        store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
        store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      }
      if (mode === "pencil") {
        imageDataSaveClean();
        pencilMouseUp(e);
      }
      if (mode === "line") {
        imageDataSaveClean();
        lineMouseUp(e);
      }
      if (mode === "bucket") {
        imageDataSaveClean();
        bucketMouseUp();
      }
      if (mode === "square") {
        imageDataSaveClean();
        squareMouseUp(e);
      }
      if (mode === "circle") {
        imageDataSaveClean();
        circleMouseUp(e);
      }
      if (mode === "bucket") {
        imageDataSaveClean();
      }
      if (mode === "colorPicker") {
        colorPickerMouseUp(e);
      }
      if (mode === "eraser") {
        eraserMouseUp(e);
      }
      if (mode === "select") {
        imageDataSaveClean();
        selectMouseUp(e);
      }
      if (mode === "mirrorPencil") {
        imageDataSaveClean();
        mirrorPencilMouseUp(e);
      }
      if (mode === "move") {
        moveMouseUp(e);
      }
      nextTick(() => {
        mergeCanvas();
      });
    }
    return {
      store,
      scale,
      selectArea,
      canvas,
      selectcanvas,
      layerShandowCanvas,
      backgroundCanvas,
      aboveCanvas,
      belowCanvas,
      tempCanvas,
      imageData,
      canvasMeta,
      loadingFin,
      loadingText
    };
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  user-select: none;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #141518;
}
.pe-none {
  pointer-events: none;
}
.pos-absoulte {
  position: absolute;
}
.pos-relative {
  position: relative;
}
.visb-hidden {
  visibility: hidden;
}
.layer-shadow {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  top: 0;
  left: 0;
}
.layer-main {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  top: 0;
  left: 0;
}
#canvas-container {
  margin: 0 auto;
}
</style>
