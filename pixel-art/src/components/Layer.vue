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
          ref="rename"
          type="text"
          v-model="layer.layerName"
          @blur="renameSuccess"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { initLayer } from "../util/canvas";
import clone from "lodash/clone";
import { toRaw } from "vue";
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
      renameIndex: undefined,
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
            // console.log(this.canvasCtx.canvas.toDataURL("image/png"));
          }
        }
        if (i > index) {
          console.log(`${layerName} 合到上层`);
          this.tempCanvasCtx.putImageData(canvaImageData, 0, 0);
          const { canvas } = this.tempCanvasCtx;
          // console.log(canvas.toDataURL("image/png"));
          this.aboveCanvasCtx.drawImage(canvas, 0, 0);
        }
      }
      this.tempCanvasCtx.clearRect(0, 0, width, height);
    },
    up(this: any, index: number) {
      if (this.currentLayerIndex !== this.layers.length - 1) {
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
        // 此处先把要交换的下层canvas imagedata取出，并绘制到当前画布
        // 不这么做的话在下面进行数据交换之后，在choose函数内，执行
        // this.$store.state.canvasModule.pages[currentPageIndex].layers[
        //   currentLayerIndex
        // ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);会导致数据异常
        // 实际上，是把当前的画布信息写入了 被交换前的下层canvas imagedata中
        // 举例 执行down(1)
        //  当前index 1 ,canvasCtx里的图像是1
        // |index| layer| 绘制图像|
        // |1    |  1   |  1     |
        // |0    |  0   |  0     |
        // 将layer 1 下移到layer 0
        //  当前index是 1 ,canvasCtx里的图像是0
        // |index| layer| 绘制图像|
        // |1    |  1   |  1     |
        // |0    |  1   |  0     |
        // 执行choose(0)
        // 这时的currentLayerIndex还是1
        // 执行
        // this.$store.state.canvasModule.pages[currentPageIndex].layers[
        //   currentLayerIndex
        // ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);
        // 后，当前index是 1, 所以
        // |index| layer| 绘制图像 |
        // |0    |  1   |  1      |
        // |1    |  0   |  0 ->  1|
        // 修复
        // 会导致绘制异常,所以在交换两层数据之前，手动把要被交换的那一层的数据先绘制到当前画布
        // const { currentPageIndex } = this.$store.state.canvasModule;
        // const { canvaImageData } = this.$store.state.canvasModule.pages[
        //   currentPageIndex
        // ].layers[index - 1];
        // this.canvasCtx.putImageData(canvaImageData, 0, 0);
        //  当前index是 1 ,canvasCtx里的图像 1->0
        // |index| layer| 绘制图像|
        // |1    |  1   |  1     |
        // |0    |  1   |  0     |
        // 执行choose(0)
        // 这时的currentLayerIndex还是1
        // 执行
        // this.$store.state.canvasModule.pages[currentPageIndex].layers[
        //   currentLayerIndex
        // ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);
        // 后，当前index是 1, canvasCtx里的图像是0 所以
        // |index| layer| 绘制图像 |
        // |0    |  1   |  1      |
        // |1    |  0   |  0 ->  0|
        // 数据就对了
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
      const { currentPageIndex } = this.$store.state.canvasModule;
      const length = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers.length;
      if (length === 1) {
        return;
      }
      this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers.splice(index, 1);
      const newLength = this.$store.state.canvasModule.pages[
        this.$store.state.canvasModule.currentPageIndex
      ].layers.length;
      if (index !== 0) {
        if (newLength === 1) {
          const { canvaImageData } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[0];
          this.canvasCtx.putImageData(canvaImageData, 0, 0);
          this.$store.state.canvasModule.currentLayerIndex = 0;
          this.choose(0);
        } else {
          const { canvaImageData } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[index - 1];
          this.canvasCtx.putImageData(canvaImageData, 0, 0);
          this.$store.state.canvasModule.currentLayerIndex = index - 1;
          this.choose(index - 1);
        }
      } else {
        if (newLength === 1) {
          const { canvaImageData } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[0];
          this.canvasCtx.putImageData(canvaImageData, 0, 0);
          this.$store.state.canvasModule.currentLayerIndex = 0;
          this.choose(0);
        } else {
          const { canvaImageData } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[index + 1];
          this.canvasCtx.putImageData(canvaImageData, 0, 0);
          this.$store.state.canvasModule.currentLayerIndex = index + 1;
          this.choose(index + 1);
        }
      }
      this.setPreview();
    },
    mergeUp(this: any, index: number) {
      if (index === this.layers.length - 1) {
        return;
      }
      const {
        width,
        height,
        currentPageIndex,
        canvasCtx
      } = this.$store.state.canvasModule;
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index
      ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
      const { canvaImageData } = this.$store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index];
      const {
        canvaImageData: upImageData
      } = this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index + 1
      ];
      canvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.putImageData(upImageData, 0, 0);
      canvasCtx.drawImage(this.tempCanvasCtx.canvas, 0, 0);
      this.tempCanvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.putImageData(canvaImageData, 0, 0);
      canvasCtx.drawImage(this.tempCanvasCtx.canvas, 0, 0);
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index + 1
      ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
      for (
        let x = 0;
        x <
        this.$store.state.canvasModule.pages[currentPageIndex].layers[index + 1]
          .layer.length;
        x++
      )
        for (
          let y = 0;
          y <
          this.$store.state.canvasModule.pages[currentPageIndex].layers[
            index + 1
          ].layer[x].length;
          y++
        ) {
          const { color } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[index].layer[x][y];
          if (color) {
            this.$store.state.canvasModule.pages[currentPageIndex].layers[
              index + 1
            ].layer[x][y].color = color;
          }
        }
      this.deleteLayer(index);
    },
    mergeDown(this: any, index: number) {
      if (index === 0) {
        return;
      }
      const {
        width,
        height,
        currentPageIndex,
        canvasCtx
      } = this.$store.state.canvasModule;
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index
      ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
      const { canvaImageData } = this.$store.state.canvasModule.pages[
        currentPageIndex
      ].layers[index];
      const {
        canvaImageData: downImageData
      } = this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index - 1
      ];
      canvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.putImageData(downImageData, 0, 0);
      canvasCtx.drawImage(this.tempCanvasCtx.canvas, 0, 0);
      this.tempCanvasCtx.clearRect(0, 0, width, height);
      this.tempCanvasCtx.putImageData(canvaImageData, 0, 0);
      canvasCtx.drawImage(this.tempCanvasCtx.canvas, 0, 0);
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index - 1
      ].canvaImageData = canvasCtx.getImageData(0, 0, width, height);
      for (
        let x = 0;
        x <
        this.$store.state.canvasModule.pages[currentPageIndex].layers[index - 1]
          .layer.length;
        x++
      )
        for (
          let y = 0;
          y <
          this.$store.state.canvasModule.pages[currentPageIndex].layers[
            index - 1
          ].layer[x].length;
          y++
        ) {
          const { color } = this.$store.state.canvasModule.pages[
            currentPageIndex
          ].layers[index].layer[x][y];
          if (color) {
            this.$store.state.canvasModule.pages[currentPageIndex].layers[
              index - 1
            ].layer[x][y].color = color;
          }
        }
      this.deleteLayer(index);
    },
    copy(this: any, index: number) {
      const {
        currentPageIndex,
        width,
        height
      } = this.$store.state.canvasModule;
      let newLayerData = clone(
        toRaw(
          this.$store.state.canvasModule.pages[currentPageIndex].layers[index]
        )
      );
      let layer: Array<any> = [];
      for (let x = 0; x < newLayerData.layer.length; x++)
        for (let y = 0; y < newLayerData.layer[x].length; y++) {
          if (!Array.isArray(layer[x])) {
            layer[x] = [];
          }
          layer[x][y] = { ...newLayerData.layer[x][y] };
        }
      newLayerData.layer = layer;
      newLayerData.key = `${newLayerData.key}_copy_${Math.random() * 100}`;
      newLayerData.layerName = `${newLayerData.layerName}_copy`;
      newLayerData.canvaImageData = this.canvasCtx.getImageData(
        0,
        0,
        width,
        height
      );
      this.$store.state.canvasModule.pages[currentPageIndex].layers[
        index
      ].canvaImageData = this.canvasCtx.getImageData(0, 0, width, height);
      this.$store.state.canvasModule.pages[currentPageIndex].layers.push(
        newLayerData
      );
    },
    rename(this: any, index: number) {
      console.log("rename", index);
      this.renameIndex = index;
      this.$nextTick(() => {
        const { rename } = this.$refs;
        rename.focus();
      });
    },
    renameSuccess(this: any) {
      this.renameIndex = undefined;
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
