<template>
  <div class="tools">
    <div class="image-preview-container">
      <img :src="previewUrl" alt="" class="image-preview" />
    </div>
    <div class="attribute-box">
      <div class="title">画布信息</div>
      <div class="info-layer-size">{{ width }} * {{ height }}</div>
      <div v-if="girdMeta">
        x:{{ girdMeta.columnIndex + 1 }} y:{{ girdMeta.rowIndex + 1 }}
      </div>
    </div>
    <div class="attribute-box">
      <layer />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useWrapStore } from "../store/index";
import layer from "./Layer.vue";
export default {
  name: "CanvasAttribute",
  components: {
    layer
  },
  setup() {
    const store = useWrapStore();
    const colors = reactive([
      "red",
      "yellow",
      "blue",
      "green",
      "black",
      "white"
    ]);
    const girdMeta = computed(
      () => store.getters["canvasModule/currentGridMeta"]
    );
    const currentPageIndex = computed(
      () => store.state.canvasModule.currentPageIndex
    );
    const previewUrl = computed(() => {
      const pages = store.state.canvasModule.pages;
      const length = pages.length;
      if (length < 1) return "";
      const { previewUrl } = store.state.canvasModule.pages[
        currentPageIndex.value
      ];
      if (previewUrl) {
        return previewUrl;
      }
      return "";
    });
    const height = computed(() => {
      const { height } = store.state.canvasModule;
      return height;
    });
    const width = computed(() => {
      const { width } = store.state.canvasModule;
      return width;
    });
    return {
      colors,
      previewUrl,
      width,
      height,
      girdMeta
    };
  }
};
</script>

<style lang="scss" scoped>
.btn-group-operator {
  margin-top: 10px;
  display: flex;
}
.btn-operator {
  display: flex;
  justify-content: center;
  width: 200px;
  padding: 10px;
  border-radius: 4px;
  background: rgb(255, 220, 220);
}
.btn-operator:last-of-type {
  margin-left: 10px;
}
.box {
  display: flex;
}
.tools {
  padding: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #333;
  color: white;
}
ul {
  padding: 0;
  list-style: none;
}
.color-choose ul {
  display: flex;
}
.color-choose ul li {
  border: 1px solid rgba(218, 216, 216, 0.567);
  border-radius: 4px;
  margin-right: 10px;
}
.current-color {
  width: 100%;
  height: 50px;
}
.image-preview-container {
  display: flex;
  padding: 10px;
  justify-content: center;
  border: 2px solid rgba(122, 139, 235, 0.315);
}
.image-preview {
  height: 100px;
  image-rendering: pixelated;
}
.attribute-box {
  .title {
    font-size: 16px;
  }
  padding: 10px;
  margin: 5px 0;
  border: 2px solid rgba(122, 139, 235, 0.315);
  text-align: left;
  font-size: 14px;
}
</style>
