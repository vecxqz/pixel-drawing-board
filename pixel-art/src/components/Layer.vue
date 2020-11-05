<template>
  <div>当前选中层{{ currentLayer.layerName }}</div>
  <div class="btn-group">
    <span class="btn-layer-operate">
      <img src="../assets/create.svg" @click="create" class="layer-create" />
    </span>
    <span class="btn-layer-operate">
      <img
        src="../assets/arrow.svg"
        @click="up(currentLayerIndex)"
        class="layer-up"
      />
    </span>
    <span class="btn-layer-operate" @click="down(currentLayerIndex)">
      <img src="../assets/arrow.svg" class="layer-down" />
    </span>
    <span class="btn-layer-operate" @click="rename(currentLayerIndex)">
      <img src="../assets/rename.svg" class="layer-rename" />
    </span>
    <span class="btn-layer-operate" @click="copy(currentLayerIndex)">
      <img src="../assets/copy.svg" class="layer-copy" />
    </span>
    <span class="btn-layer-operate" @click="mergeUp(currentLayerIndex)">
      <img src="../assets/merge.svg" class="layer-merge-up" />
    </span>
    <span class="btn-layer-operate" @click="mergeDown(currentLayerIndex)">
      <img src="../assets/merge.svg" class="layer-merge-down" />
    </span>
    <span @click="deleteLayer(currentLayerIndex)" class="btn-layer-operate">
      <img src="../assets/trash.svg" />
    </span>
  </div>
  <ul>
    <li
      v-for="(layer, index) in layerReverse"
      @dblclick="rename(currentLayerIndex)"
      :key="layer.key"
      class="layer"
      @click="choose(layerReverse.length - index - 1)"
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
          v-model="layer.layerName"
          @blur="renameSuccess"
          @keydown.enter="blurInput"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { useLayer } from "../composables/useLayer";
export default {
  setup() {
    const {
      create,
      up,
      down,
      rename,
      renameElement,
      copy,
      mergeUp,
      mergeDown,
      deleteLayer,
      renameIndex,
      layerReverse,
      currentLayerIndex,
      renameSuccess,
      blurInput,
      currentLayer,
      choose
    } = useLayer();
    return {
      create,
      up,
      down,
      rename,
      renameElement,
      copy,
      mergeUp,
      mergeDown,
      deleteLayer,
      renameIndex,
      layerReverse,
      currentLayerIndex,
      renameSuccess,
      blurInput,
      currentLayer,
      choose
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
