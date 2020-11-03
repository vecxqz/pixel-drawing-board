<template>
  <div id="canvas">
    <div
      id="canvas-container"
      class="pos-relative"
      :style="
        `width:${$store.state.canvasModule.width}px;
        height:${$store.state.canvasModule.height}px`
      "
    >
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-background"
        ref="backgroundCanvas"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-below"
        ref="belowCanvas"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte layer-main"
        ref="canvas"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-above"
        ref="aboveCanvas"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-select"
        :class="{ 'visb-hidden': !selectArea.isSet }"
        ref="selectcanvas"
        :style="{
          left: selectArea.left,
          top: selectArea.top
        }"
        :width="selectArea.width"
        :height="selectArea.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow"
        ref="layerShandowCanvas"
        style="visibility: hidden"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <canvas
        class="pos-absoulte pe-none layer-shadow layer-temp"
        ref="tempCanvas"
        style="visibility: hidden"
        :width="$store.state.canvasModule.width"
        :height="$store.state.canvasModule.height"
      />
      <div style="color:white">{{ selectArea }}</div>
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
import { initGrid } from "../util/canvas";
import { isUndefined } from "../util/common";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, map, takeUntil, tap, debounceTime } from "rxjs/operators";
export default {
  name: "Canvas",
  setup(this: any) {
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
      selectArea: selectAreaData
    } = useSelect();
    const {
      mouseDown: recordMouseDownPosition,
      mouseMove: recordMouseMovePosition,
      mouseUp: recordMouseUpPosition
    } = useMousePosition();
    const { setCurrentColor } = useColor();
    const { setCanvasPreview, setCanvasPreviewByImageData } = userPreview();
    return {
      pencilMouseDown,
      pencilMouseMove,
      pencilMouseUp,
      bucketMouseDown,
      bucketMouseMove,
      bucketMouseUp,
      lineMouseDown,
      lineMouseMove,
      lineMouseUp,
      squareMouseDown,
      squareMouseMove,
      squareMouseUp,
      colorPickerMouseDown,
      colorPickerMouseMove,
      colorPickerMouseUp,
      circleMouseDown,
      circleMouseMove,
      circleMouseUp,
      eraserMouseDown,
      eraserMouseMove,
      eraserMouseUp,
      recordMouseDownPosition,
      recordMouseMovePosition,
      recordMouseUpPosition,
      selectMouseDown,
      selectMouseMove,
      selectMouseUp,
      selectAreaData,
      setCurrentColor,
      setCanvasPreview,
      setCanvasPreviewByImageData,
      mirrorPencilMouseDown,
      mirrorPencilMouseMove,
      mirrorPencilMouseUp
    };
  },
  data() {
    return {
      imageData: undefined,
      isboundary: false,
      boundaryMeta: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      }
    };
  },
  computed: {
    selectArea(this: any) {
      const { size } = this.$store.state.canvasModule;
      const { startX, startY, endX, endY, isSet } = this.selectAreaData;
      let left = 0,
        top = 0,
        width = 0,
        height = 0;
      if (startX >= endX) {
        left = endX * size;
        width = (startX - endX + 1) * size;
      } else {
        left = startX * size;
        width = (endX - startX + 1) * size;
      }
      if (startY >= endY) {
        top = endY * size;
        height = (startY - endY + 1) * size;
      } else {
        top = startY * size;
        height = (endY - startY + 1) * size;
      }
      return {
        isSet: isSet,
        width: width,
        height: height,
        left: `${left + 0}px`,
        top: `${top + 0}px`,
        startX,
        startY,
        endX,
        endY
      };
    },
    canvasCtx(this: any) {
      return this.$store.state.canvasModule.canvasCtx;
    },
    backgroundCanvasCtx(this: any) {
      return this.$store.state.canvasModule.backgroundCanvasCtx;
    },
    shadowCanvasCtx(this: any) {
      return this.$store.state.canvasModule.shadowLayerCanvasCtx;
    },
    tempCanvasCtx(this: any) {
      return this.$store.state.canvasModule.tempCanvasCtx;
    },
    belowCanvasCtx(this: any): CanvasRenderingContext2D {
      return this.$store.state.canvasModule.belowCanvasCtx;
    },
    aboveCanvasCtx(this: any): CanvasRenderingContext2D {
      return this.$store.state.canvasModule.aboveCanvasCtx;
    },
    currentLayer(this: any) {
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      return this.$store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ];
    }
  },
  mounted(this: any) {
    // 屏蔽右键菜单
    window.oncontextmenu = function(e: MouseEvent) {
      e.preventDefault();
    };
    const {
      canvas,
      selectcanvas,
      layerShandowCanvas,
      backgroundCanvas,
      aboveCanvas,
      belowCanvas,
      tempCanvas
    } = this.$refs;
    const canvasContainer: HTMLElement = window.document.getElementById(
      "canvas-container"
    ) as HTMLElement;
    this.$store.dispatch("canvasModule/CREATE_PAGE");
    this.$store.dispatch("canvasModule/CREATE_TEMP_LAYER");
    this.$store.dispatch("canvasModule/SET_CANVASCTX", canvas);
    this.$store.dispatch(
      "canvasModule/SET_BACKGROUND_CANVAS_CANVASCTX",
      backgroundCanvas
    );
    this.$store.dispatch(
      "canvasModule/SET_SHDOW_LAYER_CANVASCTX",
      layerShandowCanvas
    );
    this.$store.dispatch("canvasModule/SET_SELECT_CANVASCTX", selectcanvas);
    this.$store.dispatch("canvasModule/SET_ABOVE_CANVASCTX", aboveCanvas);
    this.$store.dispatch("canvasModule/SET_BELOW_CANVASCTX", belowCanvas);
    this.$store.dispatch("canvasModule/SET_TEMP_LAYER_CANVASCTX", tempCanvas);
    this.parseBackground();
    this.$nextTick(() => {
      this.setCanvasPreview(
        [this.backgroundCanvasCtx, this.canvasCtx],
        this.shadowCanvasCtx
      );
    });
    const document = window.document.body;
    const mouseDown = fromEvent(canvasContainer, "mousedown");
    const mouseMove = fromEvent(canvasContainer, "mousemove");
    const mouseUp = fromEvent(document, "mouseup");
    mouseDown
      .pipe(
        tap(e => {
          this.handleMouseDown(e);
        }),
        // mouseDown事件转化为mouseMove事件
        map(() =>
          mouseMove.pipe(
            // mouseUp后结束事件
            takeUntil(
              mouseUp.pipe(
                tap(e => {
                  console.log("mouseUp");
                  this.handleMouseUp(e);
                })
              )
            )
          )
        ),
        debounceTime(16, animationFrameScheduler),
        // 拍平
        concatAll()
      )
      .subscribe(e => {
        this.handleMouseMove(e);
      });
  },
  methods: {
    mergeCanvas(this: any) {
      const { width, height } = this.$store.state.canvasModule;
      this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[
        this.$store.state.canvasModule.currentLayerIndex
      ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);
      const backgroundMeta = {
        layerName: "background",
        canvaImageData: this.backgroundCanvasCtx.getImageData(
          0,
          0,
          width,
          height
        )
      };
      const belowMeta = {
        layerName: "below",
        canvaImageData: this.belowCanvasCtx.getImageData(0, 0, width, height)
      };
      const aboveMeta = {
        layerName: "above",
        canvaImageData: this.aboveCanvasCtx.getImageData(0, 0, width, height)
      };
      const currentMeta = {
        layerName: "current",
        canvaImageData: this.canvasCtx.getImageData(0, 0, width, height)
      };
      const canvasArray = [backgroundMeta, belowMeta, currentMeta, aboveMeta];
      this.setCanvasPreviewByImageData(
        canvasArray,
        this.tempCanvasCtx,
        this.shadowCanvasCtx
      );
    },
    handleMouseMove(this: any, e: any) {
      const { mode, size, width, height } = this.$store.state.canvasModule;
      let columnIndex = Math.floor(
          e.offsetX / this.$store.state.canvasModule.size
        ),
        rowIndex = Math.floor(e.offsetY / this.$store.state.canvasModule.size);
      if (columnIndex >= width / size) {
        columnIndex = width / size - 1;
      }
      if (columnIndex < 0) {
        columnIndex = 0;
      }
      if (rowIndex >= height / size) {
        rowIndex = height / size - 1;
      }
      if (rowIndex < 0) {
        rowIndex = 0;
      }
      this.recordMouseMovePosition(e);
      // console.log(columnIndex, rowIndex);
      this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
      this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      if (mode === "pencil") {
        this.pencilMouseMove(e);
      }
      if (mode === "line") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.lineMouseMove(e);
      }
      if (mode === "eraser") {
        this.eraserMouseMove(e);
      }
      if (mode === "bucket") {
        this.bucketMouseMove(e);
      }
      if (mode === "square") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.squareMouseMove(e);
      }
      if (mode === "colorPicker") {
        this.colorPickerMouseMove(e);
      }
      if (mode === "circle") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.circleMouseMove(e);
      }
      if (mode === "select") {
        this.canvasImageDataSave();
        this.canvasImageDataUse();
        this.selectMouseMove(e);
      }
      if (mode === "mirrorPencil") {
        this.mirrorPencilMouseMove(e);
      }
    },
    // parse(this: any) {
    //   const layer = this.$store.state.canvasModule.pages[
    //     this.$store.state.canvasModule.currentPageIndex
    //   ].layers[this.$store.state.canvasModule.currentLayerIndex].layer;
    //   for (let i = 0; i < layer.length; i++)
    //     for (let j = 0; j < layer.length; j++) {
    //       const cell = layer[i][j];
    //       const { color, backgroundColor } = cell;
    //       initGrid(
    //         this.canvasCtx,
    //         layer,
    //         i,
    //         j,
    //         color ? color : backgroundColor
    //       );
    //     }
    // },
    parseBackground(this: any) {
      const layer = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers[this.$store.state.canvasModule.currentLayerIndex].layer;
      for (let i = 0; i < layer.length; i++)
        for (let j = 0; j < layer.length; j++) {
          const cell = layer[i][j];
          const { backgroundColor } = cell;
          initGrid(this.backgroundCanvasCtx, layer, i, j, backgroundColor);
        }
    },
    canvasImageDataSave(this: any) {
      console.log("canvasImageDataSave");
      const { canvasCtx } = this;
      // 存储在进行绘制之前的画布数据
      if (isUndefined(this.imageData)) {
        this.imageData = canvasCtx.getImageData(
          0,
          0,
          this.$store.state.canvasModule.width,
          this.$store.state.canvasModule.height
        );
      }
    },
    canvasImageDataUse(this: any) {
      console.log("canvasImageDataUse");
      const { canvasCtx } = this;
      if (!isUndefined(this.imageData)) {
        canvasCtx.putImageData(this.imageData, 0, 0);
      }
    },
    canvasImageDataSaveClean(this: any) {
      this.imageData = undefined;
    },
    handleMouseDown(this: any, e: MouseWheelEvent) {
      const canvasContainer: HTMLElement = window.document.getElementById(
        "canvas-container"
      ) as HTMLElement;
      const {
        width,
        left,
        height,
        top
      } = canvasContainer.getBoundingClientRect();
      this.boundaryMeta.startX = left;
      this.boundaryMeta.endX = left + width;
      this.boundaryMeta.startY = left;
      this.boundaryMeta.endY = top + height;
      const { mode } = this.$store.state.canvasModule;
      this.setCurrentColor(e);
      this.recordMouseDownPosition(e);
      if (mode === "pencil") {
        this.pencilMouseDown(e);
      }
      if (mode === "line") {
        this.lineMouseDown(e);
      }
      if (mode === "bucket") {
        this.bucketMouseDown(e);
      }
      if (mode === "square") {
        this.squareMouseDown(e);
      }
      if (mode === "colorPicker") {
        this.colorPickerMouseDown(e);
      }
      if (mode === "circle") {
        this.circleMouseDown(e);
      }
      if (mode === "eraser") {
        this.eraserMouseDown(e);
      }
      if (mode === "select") {
        this.selectMouseDown(e);
      }
      if (mode === "mirrorPencil") {
        this.mirrorPencilMouseDown(e);
      }
    },
    handleMouseUp(this: any, e: MouseWheelEvent) {
      const { clientX, clientY } = e;
      const { mode, size } = this.$store.state.canvasModule;
      if (
        clientX > this.boundaryMeta.startX &&
        clientX < this.boundaryMeta.endX &&
        clientY > this.boundaryMeta.startY &&
        clientY < this.boundaryMeta.endY
      ) {
        this.$store.dispatch("canvasModule/SET_END_POINT", { e });
        let columnIndex = Math.floor(e.offsetX / size),
          rowIndex = Math.floor(e.offsetY / size);
        this.$store.dispatch("canvasModule/SET_COLUMN_INDEX", columnIndex);
        this.$store.dispatch("canvasModule/SET_ROW_INDEX", rowIndex);
      }
      if (mode === "pencil") {
        this.canvasImageDataSaveClean();
        this.pencilMouseUp(e);
      }
      if (mode === "line") {
        this.canvasImageDataSaveClean();
        this.lineMouseUp(e);
      }
      if (mode === "bucket") {
        this.canvasImageDataSaveClean();
        this.bucketMouseUp(e);
      }
      if (mode === "square") {
        this.canvasImageDataSaveClean();
        this.squareMouseUp(e);
      }
      if (mode === "circle") {
        this.canvasImageDataSaveClean();
        this.circleMouseUp(e);
      }
      if (mode === "bucket") {
        this.canvasImageDataSaveClean();
      }
      if (mode === "colorPicker") {
        this.colorPickerMouseUp(e);
      }
      if (mode === "eraser") {
        this.eraserMouseUp(e);
      }
      if (mode === "select") {
        this.canvasImageDataSaveClean();
        this.selectMouseUp(e);
      }
      if (mode === "mirrorPencil") {
        this.canvasImageDataSaveClean();
        this.mirrorPencilMouseUp(e);
      }
      this.mergeCanvas();
      // this.setCanvasPreview(
      //   [this.backgroundCanvasCtx, this.canvasCtx],
      //   this.shadowCanvasCtx
    }
  }
};
</script>

<style lang="scss" scoped>
#canvas {
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
  top: 0;
  left: 0;
}
.layer-main {
  top: 0;
  left: 0;
}
#canvas-container {
  margin: 0 auto;
}
</style>
