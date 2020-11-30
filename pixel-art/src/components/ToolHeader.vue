<template>
  <div id="toolHeader">
    <ul class="dis-flex operators">
      <!-- <li class="operator-item">文件</li>
      <li class="operator-item">设置</li> -->
      <li class="operator-item" @click="handleClickFile">文件</li>
      <li class="operator-item" @click="undo">撤销</li>
      <li class="operator-item" @click="redo">还原</li>
      <li class="operator-item" @click="handleClickSave">保存画布</li>
      <li class="operator-item" @click="handleCLickReset">重置画布</li>
      <!-- <li class="operator-item">全屏</li> -->
    </ul>

    <el-dialog
      @close="resetDialogStatus"
      :title="title"
      width="800px"
      v-model="dialogVisible"
    >
      <template v-slot:default>
        <el-container>
          <el-aside class="aside">
            <div
              :class="{ highlight: mode === 'file' }"
              class="op-item"
              @click="modeChange('file')"
            >
              新建工程
            </div>
            <div
              :class="{ highlight: mode === 'save' }"
              class="op-item"
              @click="modeChange('save')"
            >
              保存工程
            </div>
            <div
              :class="{ highlight: mode === 'download' }"
              class="op-item"
              @click="modeChange('download')"
            >
              下载图片
            </div>
            <div
              :class="{ highlight: mode === 'import' }"
              class="op-item"
              @click="modeChange('import')"
            >
              导入图片
            </div>
            <div
              :class="{ highlight: mode === 'importPublic' }"
              class="op-item"
              @click="modeChange('importPublic')"
            >
              导入分享工程
            </div>
          </el-aside>
          <el-main class="main">
            <div v-if="mode === 'file'" :class="`mode-${mode}`">
              <div class="title">
                预设值
              </div>
              <div class="input-item presets">
                <el-button
                  v-for="item in presetsArray"
                  :key="item.label"
                  @click="usePreset(item.width, item.height)"
                  >{{ item.label }}</el-button
                >
              </div>
              <div class="title">
                画布宽度(px)
              </div>
              <div class="input-item">
                <el-input-number
                  v-model="canvasMeta.width"
                  controls-position="right"
                  :min="1"
                  :max="700"
                ></el-input-number>
              </div>
              <div class="title">
                画布高度(px)
              </div>
              <div class="input-item">
                <el-input-number
                  v-model="canvasMeta.height"
                  controls-position="right"
                  :min="1"
                  :max="700"
                ></el-input-number>
              </div>
              <el-button
                type="primary"
                class="btn-create"
                @click="handleCLickCreate"
                >新建画布</el-button
              >
            </div>
            <div v-if="mode === 'save'" :class="`mode-${mode}`">
              <el-button
                class="btn-save"
                type="primary"
                @click="handleClickSave"
                >保存工程</el-button
              >
            </div>
            <div v-if="mode === 'download'" :class="`mode-${mode}`">
              <div class="download-line">
                <div>尺寸</div>
                <div>
                  <el-select
                    v-model="layerScale"
                    placeholder="请选择下载图片比例"
                  >
                    <el-option
                      v-for="item in sclaeOptions"
                      :key="item.value"
                      :label="
                        `${item.label * canvasWidth}px * ${item.label *
                          canvasHeight}px`
                      "
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-button type="primary" @click="downloadImage(layerScale)"
                    >下载</el-button
                  >
                </div>
              </div>
              <div class="download-line">
                <div>尺寸</div>
                <div>
                  <el-select
                    v-model="gifScale"
                    placeholder="请选择下载图片比例"
                  >
                    <el-option
                      v-for="item in sclaeOptions"
                      :key="item.value"
                      :label="
                        `${item.label * canvasWidth}px * ${item.label *
                          canvasHeight}px`
                      "
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-button type="primary" @click="downloadImageGIF(gifScale)"
                    >下载GIF</el-button
                  >
                </div>
              </div>
            </div>
            <div v-if="mode === 'import'" :class="`mode-${mode}`">
              <el-button
                class="btn-import"
                type="primary"
                @click="importImage.click()"
                >导入图片</el-button
              >
              <input
                class="dis-none"
                type="file"
                name="importImage"
                ref="importImage"
                id=""
              />
            </div>
            <div v-if="mode === 'importPublic'" :class="`mode-${mode}`">
              ...建设中...
            </div>
          </el-main>
        </el-container>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { useDoState } from "../composables/useDoState";
import { useDownload } from "../composables/useDownload";
import { useFile } from "../composables/useFile";
import { useWrapStore } from "../store/index";
import { ref, computed, reactive, onMounted, nextTick } from "vue";
import { useLayer } from "../composables/useLayer";
import { useSelect } from "../composables/useSelect";
import { usePreview } from "../composables/usePreview";

export default {
  name: "ToolHeader",
  setup() {
    const store = useWrapStore();
    const { cancelSelect } = useSelect();
    const { mergeCanvas } = usePreview();
    const { create } = useLayer();
    const { toUndoStack, TYPE, redo, undo } = useDoState();
    const { downloadImage, downloadImageGIF } = useDownload();
    const dialogVisible = ref(false);
    const { save, reset } = useFile();
    const mode = ref("file");
    const layerScale = ref(1);
    const gifScale = ref(1);
    const importImage = ref(undefined as unknown);
    const sclaeOptions = ref([] as Array<any>);
    const canvasMeta = reactive({
      width: 40,
      height: 40
    });
    const presetsArray = ref([
      {
        label: "32x32",
        width: 32,
        height: 32
      },
      {
        label: "100x100",
        width: 100,
        height: 100
      },
      {
        label: "256x144",
        width: 256,
        height: 144
      },
      {
        label: "500x500",
        width: 500,
        height: 500
      }
    ]);
    const title = computed(
      () =>
        (({
          file: "文件",
          download: "下载",
          save: "保存",
          import: "导入",
          importPublic: "导入分享工程"
        } as any)[mode.value])
    );
    const canvasWidth = computed(() => store.state.canvasModule.width);
    const canvasHeight = computed(() => store.state.canvasModule.height);
    // const currentPageIndex = computed(
    //   () => store.state.canvasModule.currentPageIndex
    // );
    // const currentLayerIndex = computed(
    //   () => store.state.canvasModule.currentLayerIndex
    // );

    onMounted(() => {
      sclaeOptions.value = new Array(20)
        .fill(0)
        .map((v: number, index: number) => ({
          label: index + 1,
          value: index + 1
        }));
    });

    function createLayer() {
      cancelSelect();
      mergeCanvas();
      const data: any = create();
      toUndoStack({ ...data, type: TYPE.LAYER_CREATE }, true);
    }

    async function handleClickSave() {
      const result = await save();
      if (result) {
        dialogVisible.value = false;
      }
    }

    function handleCLickCreate() {
      reset({ width: canvasMeta.width, height: canvasMeta.height });
      dialogVisible.value = false;
    }

    function handleCLickReset() {
      const { width, height } = store.state.canvasModule;
      reset({ width, height });
      dialogVisible.value = false;
    }

    function usePreset(width: number, height: number) {
      canvasMeta.width = width;
      canvasMeta.height = height;
    }

    function handleClickFile() {
      dialogVisible.value = true;
    }

    function handleUpload(inputChangeEvent: any) {
      const input = inputChangeEvent.target;
      const files = input.files;
      const { length } = files;

      if (length < 0) return;
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;

        const image = new Image();
        // iw/ih = cw/ch
        // ih = iw*ch/cw
        image.onload = () => {
          let widthScale = canvasWidth.value / image.width;
          let heightScale = canvasHeight.value / image.height;
          let whScale = image.width / image.height;
          createLayer();
          if (widthScale >= 1 || heightScale >= 1) {
            store.state.canvasModule.canvasCtx.drawImage(image, 0, 0);
          } else {
            let width = widthScale > 1 ? image.width : image.width * widthScale;
            let height =
              heightScale > 1
                ? image.height
                : (image.height * heightScale) / whScale;
            console.log(width, height);
            store.state.canvasModule.canvasCtx.drawImage(
              image,
              0,
              0,
              width,
              height
            );
          }
          mergeCanvas();
          input.value = "";
        };

        image.src = result;
      };

      fileReader.readAsDataURL(files[0]);
    }

    function modeChange(modeValue: string) {
      mode.value = modeValue;
      if (modeValue === "import") {
        nextTick(() => {
          (importImage.value as Element).addEventListener(
            "change",
            handleUpload
          );
        });
      }
    }

    function resetDialogStatus() {
      mode.value = "file";
      layerScale.value = 1;
      gifScale.value = 1;
    }

    return {
      redo,
      undo,
      downloadImage,
      downloadImageGIF,
      handleClickSave,
      handleCLickReset,
      dialogVisible,
      mode,
      title,
      canvasMeta,
      presetsArray,
      usePreset,
      layerScale,
      gifScale,
      sclaeOptions,
      handleCLickCreate,
      handleClickFile,
      importImage,
      modeChange,
      resetDialogStatus,
      canvasWidth,
      canvasHeight
    };
  }
};
</script>

<style lang="scss" scoped>
.dis-flex {
  display: flex;
}
.dis-none {
  display: none;
}
.operators {
  height: 100%;
  font-size: 12px;
}
.operator-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.075);
  }
}
::v-deep(.el-dialog__header) {
  padding: 15px 20px 10px;
  font-size: 18px;
  line-height: 14px;
  background-color: #2979ff;
  user-select: none;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 16px;
  }
  .el-dialog__close.el-icon.el-icon-close {
    color: #fff;
    font-size: 22px;
    font-weight: 900;
  }
}
::v-deep(.el-dialog__body) {
  padding: 0;
  .el-container {
    min-height: 350px;
  }
}
.aside {
  max-width: 200px;
  padding: 20px;
  background-color: #e5ecf2;
  position: relative;
  overflow: hidden;
  .op-item {
    height: 40px;
    padding-top: 8px;
    padding-left: 40px;
    margin: 5px 0;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.15s;
    &.highlight {
      background: #2979ff;
      color: #fff;
    }

    &:not(.highlight):hover {
      background: #fff;
      color: #000;
    }
  }
}
.main {
  .title {
    margin-bottom: 10px;
  }
  .input-item {
    margin-bottom: 15px;
  }
  .btn-create {
    width: 100%;
  }
  .btn-save {
    width: 100%;
  }
  .btn-import {
    width: 100%;
  }
  ::v-deep(.el-input-number) {
    width: 100%;
  }
  .download-line {
    display: flex;
    align-items: center;
    margin: 10px 0;
    > div {
      &:nth-of-type(1) {
        flex-shrink: 1;
        margin-right: 20px;
      }
      &:nth-of-type(2) {
        flex-shrink: 1;
      }
      &:nth-of-type(3) {
        flex-shrink: 1;
        margin-left: 20px;
      }
    }
  }
}
</style>