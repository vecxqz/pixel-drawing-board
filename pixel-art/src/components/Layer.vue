<template>
  <div>当前选中层{{ currentLayer.layerName }}</div>
  <div class="btn-group">
    <el-tooltip content="创建图层">
      <span class="btn-layer-operate" @click="createLayer">
        <img src="../assets/create.svg" class="layer-create" />
      </span>
    </el-tooltip>
    <el-tooltip content="上移图层">
      <span class="btn-layer-operate" @click="upLayer(currentLayerIndex)">
        <img src="../assets/arrow.svg" class="layer-up" />
      </span>
    </el-tooltip>
    <el-tooltip content="下移图层">
      <span class="btn-layer-operate" @click="downLayer(currentLayerIndex)">
        <img src="../assets/arrow.svg" class="layer-down" />
      </span>
    </el-tooltip>
    <el-tooltip content="图层重命名">
      <span class="btn-layer-operate" @click="rename(currentLayerIndex)">
        <img src="../assets/rename.svg" class="layer-rename" />
      </span>
    </el-tooltip>
    <el-tooltip content="复制图层">
      <span class="btn-layer-operate" @click="copyLayer(currentLayerIndex)">
        <img src="../assets/copy.svg" class="layer-copy" />
      </span>
    </el-tooltip>
    <el-tooltip content="向上合并图层">
      <span class="btn-layer-operate" @click="mergeUpLayer(currentLayerIndex)">
        <img src="../assets/merge.svg" class="layer-merge-up" />
      </span>
    </el-tooltip>
    <el-tooltip content="向下合并图层">
      <span
        class="btn-layer-operate"
        @click="mergeDownLayer(currentLayerIndex)"
      >
        <img src="../assets/merge.svg" class="layer-merge-down" />
      </span>
    </el-tooltip>
    <el-tooltip content="删除图层">
      <span @click="deleteLayerA(currentLayerIndex)" class="btn-layer-operate">
        <img src="../assets/trash.svg" />
      </span>
    </el-tooltip>
  </div>
  <ul>
    <li
      v-for="(layer, index) in layerReverse"
      @dblclick="rename(currentLayerIndex)"
      :key="layer.key"
      class="layer"
      @click="handleChooseLayer(layerReverse.length - index - 1)"
    >
      <div
        v-if="+renameIndex !== layerReverse.length - index - 1"
        :class="{
          highlight: +currentLayerIndex === layerReverse.length - index - 1
        }"
      >
        {{ layer.layerName }}
      </div>
      <div class="layer-rename" v-else>
        <input
          ref="renameElement"
          type="text"
          @input="changeLayerName"
          :value="layer.layerName"
          @focus="renameStart"
          @blur="renameFinish"
          @keydown.enter="blurInput"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { useLayer } from "../composables/useLayer";
import { useSelect } from "../composables/useSelect";
import { useLayerName } from "../composables/useLayerName";
import { useDoState } from "../composables/useDoState";
import { useChoose } from "../composables/useChoose";
import { usePreview } from "../composables/usePreview";
export default {
  setup() {
    const { cancelSelect } = useSelect();
    const { mergeCanvas } = usePreview();
    const { toUndoStack, TYPE } = useDoState();
    const {
      changeLayerName,
      renameStart,
      renameFinish,
      blurInput,
      renameIndex,
      renameElement,
      rename
    } = useLayerName();
    const {
      create,
      up,
      down,
      copy,
      mergeUp,
      mergeDown,
      deleteLayer,
      layerReverse,
      currentLayerIndex,
      currentLayer
    } = useLayer();
    const { chooseLayer } = useChoose();
    function createLayer() {
      cancelSelect();
      mergeCanvas();
      const data: any = create();
      toUndoStack({ ...data, type: TYPE.LAYER_CREATE }, true);
    }
    function deleteLayerA(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = deleteLayer(index);
      toUndoStack({ ...data, type: TYPE.LAYER_DELETE }, true);
    }
    function upLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = up(index);
      toUndoStack({ ...data, type: TYPE.LAYER_UP }, true);
    }
    function downLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = down(index);
      toUndoStack({ ...data, type: TYPE.LAYER_DOWN }, true);
    }
    function copyLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = copy(index);
      toUndoStack({ ...data, type: TYPE.LAYER_COPY }, true);
    }
    function mergeUpLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = mergeUp(index);
      toUndoStack({ ...data, type: TYPE.LAYER_MERGE_UP }, true);
    }
    function mergeDownLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      const data = mergeDown(index);
      toUndoStack({ ...data, type: TYPE.LAYER_MERGE_DOWN }, true);
    }
    function handleChooseLayer(index: number) {
      cancelSelect();
      mergeCanvas();
      chooseLayer(index);
    }
    return {
      currentLayer,
      upLayer,
      downLayer,
      rename,
      renameElement,
      copyLayer,
      mergeUpLayer,
      mergeDownLayer,
      deleteLayerA,
      renameIndex,
      layerReverse,
      currentLayerIndex,
      renameFinish,
      blurInput,
      handleChooseLayer,
      changeLayerName,
      renameStart,
      createLayer
    };
  }
};
</script>
<style lang="scss" scoped>
.layer {
  margin: 2px 0;
  div {
    padding: 2px 4px;
  }
}
.highlight {
  background: rgba(122, 139, 235, 0.315);
}
.btn-operate {
  margin-right: 5px;
  cursor: pointer;
}
.layer-up {
  transform: rotate(180deg);
}
.layer-merge-down {
  transform: rotate(180deg);
}
.btn-layer-operate {
  cursor: pointer;
  img {
    height: 16px;
    width: 16px;
  }
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  span {
    padding: 10px;
    display: flex;
    align-content: center;
    width: 25%;
  }
}
</style>
