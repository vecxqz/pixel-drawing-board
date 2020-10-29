<template>
  <div>当前选中层{{ currentLayerIndex }}</div>
  <ul class="btn-group">
    <li
      v-for="operate in operates"
      @click="factory(operate.mode)"
      :key="operate.key"
    >
      {{ operate.name }}
    </li>
  </ul>
  <ul>
    <li
      :class="{ highlight: currentLayerIndex === +layer.key }"
      v-for="layer in layers"
      :key="layer.key"
      @click="choose(layer.key)"
    >
      {{ layer.layerName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { initLayer } from "../util/canvas";
export default {
  data() {
    return {
      operates: [
        {
          name: "创建新图层",
          key: "创建新图层",
          mode: "create"
        }
      ]
    };
  },
  computed: {
    layers(this: any) {
      if (
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ]
      ) {
        return this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers;
      }
      return [];
    },
    currentLayerIndex(this: any) {
      return this.$store.state.canvasModule.currentLayerIndex;
    }
  },
  methods: {
    factory(this: any, mode: string) {
      if (mode === "create") {
        const { width, height, size } = this.$store.state.canvasModule;
        const layer: layer = initLayer(width, height, size);
        const index = this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers.length;
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers.push({
          layer: layer,
          layerName: `layer${index}`,
          key: `${index}`
        });
      }
    },
    choose(this: any, key: string) {
      const { key: layerKey } = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers.find((layerMeta: layerMeta) => layerMeta.key === key);
      this.$store.state.canvasModule.currentLayerIndex = +layerKey;
    }
  }
};
</script>
<style lang="scss" scoped>
.highlight {
  background: rgba(122, 139, 235, 0.315);
}
</style>
