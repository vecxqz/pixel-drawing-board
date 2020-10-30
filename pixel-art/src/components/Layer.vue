<template>
  <div>当前选中层{{ currentLayer.layerName }}</div>
  <!-- <ul class="btn-group">
    <li
      v-for="operate in operates"
      @click="factory(operate.mode)"
      :key="operate.key"
    >
      {{ operate.name }}
    </li>
  </ul> -->
  <div class="btn-group">
    <span class="btn-layer-operate">
      <img
        src="../assets/create.svg"
        @click="factory('create')"
        class="layer-create"
      />
    </span>
    <span class="btn-layer-operate">
      <img
        src="../assets/arrow.svg"
        @click="up(this.currentLayerIndex)"
        class="layer-up"
      />
    </span>
    <span class="btn-layer-operate" @click="down(this.currentLayerIndex)">
      <img src="../assets/arrow.svg" class="layer-down" />
    </span>
    <span
      @click="deleteLayer(this.currentLayerIndex)"
      class="btn-layer-operate"
    >
      <img src="../assets/trash.svg" />
    </span>
  </div>
  <ul>
    <li
      v-for="(layer, index) in layerReverse"
      :class="{
        highlight: +currentLayerIndex === layerReverse.length - index - 1
      }"
      :key="layer.key"
      @click="choose(layerReverse.length - 1 - index)"
    >
      {{ layer.layerName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { initLayer } from "../util/canvas";
import { userPreview } from "../composables/userPreview";
export default {
  setup(this: any) {
    const { setCanvasPreviewByImageData } = userPreview();
    return {
      setCanvasPreviewByImageData
    };
  },
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
    layerReverse(this: any) {
      return [...this.layers].reverse();
    },
    currentLayerIndex(this: any) {
      return this.$store.state.canvasModule.currentLayerIndex;
    },
    currentLayer(this: any) {
      const {
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      const page = this.$store.state.canvasModule.pages[currentPageIndex];
      if (page) {
        return this.$store.state.canvasModule.pages[currentPageIndex].layers[
          currentLayerIndex
        ];
      }
      return [];
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
          key: `${index}`,
          canvaImageData: undefined
        });
        this.choose(index);
      }
    },
    choose(this: any, index: number) {
      const {
        width,
        height,
        currentPageIndex,
        currentLayerIndex
      } = this.$store.state.canvasModule;
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        currentLayerIndex
      ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);
      this.canvasCtx.clearRect(0, 0, width, height);
      this.belowCanvasCtx.clearRect(0, 0, width, height);
      this.aboveCanvasCtx.clearRect(0, 0, width, height);
      this.$store.state.canvasModule.currentLayerIndex = index;
      // 下标大于当前index的放到上层，下标小于当前inex的放到下层
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        const { canvaImageData, layerName } = layer;
        if (i < index) {
          console.log(`${layerName} 合到下层`);
          this.tempCanvasCtx.putImageData(canvaImageData, 0, 0);
          const { canvas } = this.tempCanvasCtx;
          this.belowCanvasCtx.drawImage(canvas, 0, 0);
        }
        if (i === index) {
          // 说明下层数据已合并完，清除临时层的画布内容，绘制上层数据
          // 如果该层存在数据，则把该层数据绘制到canvas上
          this.tempCanvasCtx.clearRect(0, 0, width, height);
          if (canvaImageData) {
            this.canvasCtx.putImageData(canvaImageData, 0, 0);
          }
        }
        if (i > index) {
          console.log(`${layerName} 合到上层`);
          this.tempCanvasCtx.putImageData(canvaImageData, 0, 0);
          const { canvas } = this.tempCanvasCtx;
          this.aboveCanvasCtx.drawImage(canvas, 0, 0);
        }
      }
      this.tempCanvasCtx.clearRect(0, 0, width, height);
    },
    up(this: any, index: number) {
      if (this.currentLayerIndex !== this.layerReverse.length - 1) {
        const { currentPageIndex } = this.$store.state.canvasModule;
        const { canvaImageData } = this.$store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index + 1];
        this.canvasCtx.putImageData(canvaImageData, 0, 0);
        const temp = this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index];
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index] = this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index + 1];
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index + 1] = temp;
        this.choose(index + 1);
        this.setPreview();
      }
    },
    down(this: any, index: number) {
      if (this.currentLayerIndex !== 0) {
        const { currentPageIndex } = this.$store.state.canvasModule;
        const { canvaImageData } = this.$store.state.canvasModule.pages[
          currentPageIndex
        ].layers[index - 1];
        this.canvasCtx.putImageData(canvaImageData, 0, 0);
        const temp = this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index];
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index] = this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index - 1];
        this.$store.state.canvasModule.pages[
          this.$store.state.canvasModule.currentPageIndex
        ].layers[index - 1] = temp;
        this.choose(index - 1);
        this.setPreview();
      }
    },
    deleteLayer(this: any, index: number) {
      console.log(index);
    },
    setPreview(this: any) {
      const { width, height } = this.$store.state.canvasModule;
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
    }
  }
};
</script>
<style lang="scss" scoped>
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
.btn-layer-operate {
  cursor: pointer;
  img {
    height: 16px;
  }
}
.btn-group {
  display: flex;
  span {
    display: flex;
    align-content: center;
  }
}
</style>
