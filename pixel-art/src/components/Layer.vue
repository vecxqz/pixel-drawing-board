<template>
  <div>当前选中层{{ currentLayer.layerName }}</div>
  <div class="btn-group">
    <span class="btn-layer-operate">
      <img
        src="../assets/create.svg"
        @click="createLayer"
        class="layer-create"
      />
    </span>
    <span class="btn-layer-operate">
      <img
        src="../assets/arrow.svg"
        @click="upLayer(currentLayerIndex)"
        class="layer-up"
      />
    </span>
    <span class="btn-layer-operate" @click="downLayer(currentLayerIndex)">
      <img src="../assets/arrow.svg" class="layer-down" />
    </span>
    <span class="btn-layer-operate" @click="rename(currentLayerIndex)">
      <img src="../assets/rename.svg" class="layer-rename" />
    </span>
    <span class="btn-layer-operate" @click="copyLayer(currentLayerIndex)">
      <img src="../assets/copy.svg" class="layer-copy" />
    </span>
    <span class="btn-layer-operate" @click="mergeUpLayer(currentLayerIndex)">
      <img src="../assets/merge.svg" class="layer-merge-up" />
    </span>
    <span class="btn-layer-operate" @click="mergeDownLayer(currentLayerIndex)">
      <img src="../assets/merge.svg" class="layer-merge-down" />
    </span>
    <span @click="deleteLayerA(currentLayerIndex)" class="btn-layer-operate">
      <img src="../assets/trash.svg" />
    </span>
  </div>
  <ul>
    <li
      v-for="(layer, index) in layerReverse"
      @dblclick="rename(currentLayerIndex)"
      :key="layer.key"
      class="layer"
      @click="chooseLayer(layerReverse.length - index - 1)"
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
import { useLayerName } from "../composables/useLayerName";
import { useDoState } from "../composables/useDoState";
import { useChoose } from "../composables/useChoose";
export default {
  setup() {
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
    function createLayer() {
      const data: any = create();
      toUndoStack({ ...data, type: TYPE.LAYER_CREATE }, true);
    }
    function deleteLayerA(index: number) {
      const data = deleteLayer(index);
      toUndoStack({ ...data, type: TYPE.LAYER_DELETE }, true);
    }
    function upLayer(index: number) {
      const data = up(index);
      toUndoStack({ ...data, type: TYPE.LAYER_UP }, true);
    }
    function downLayer(index: number) {
      const data = down(index);
      toUndoStack({ ...data, type: TYPE.LAYER_DOWN }, true);
    }
    function copyLayer(index: number) {
      const data = copy(index);
      toUndoStack({ ...data, type: TYPE.LAYER_COPY }, true);
    }
    function mergeUpLayer(index: number) {
      const data = mergeUp(index);
      toUndoStack({ ...data, type: TYPE.LAYER_MERGE_UP }, true);
    }
    function mergeDownLayer(index: number) {
      const data = mergeDown(index);
      toUndoStack({ ...data, type: TYPE.LAYER_MERGE_DOWN }, true);
    }
    const { chooseLayer } = useChoose();
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
      chooseLayer,
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
