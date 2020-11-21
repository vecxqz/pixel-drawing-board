import { computed, createCommentVNode } from "vue";
import { useWrapStore } from "../store/index";
import { usePreview } from "../composables/usePreview";
import { useLayer } from "./useLayer";
import { useDoState } from "../composables/useDoState";
import cloneDeep from "lodash/cloneDeep";

export function useCrop() {
  const store = useWrapStore();
  const { toUndoStack, TYPE } = useDoState();
  const { createLayerByData } = useLayer();
  const { mergeCanvas } = usePreview();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);

  // 裁剪方式
  // 1. 全部页面图层imagedata修改
  // 2. 在当前页面进行裁剪，创建一个裁剪好的新图层
  // 3. 只支持单页裁剪，多页不支持裁剪,在原工程上裁剪
  // 4. 只支持单页裁剪，多页不支持裁剪，创建一个新的已经裁剪好的工程文件,不影响原工程
  function cropNewLayer({ startX = 0, startY = 0, endX = 0, endY = 0 } = {}) {
    const {
      width,
      height,
      currentPageIndex,
      currentLayerIndex
    } = store.state.canvasModule;
    const diffX = endX - startX,
      diffY = endY - startY;
  }

  return {
    cropNewLayer
  };
}
