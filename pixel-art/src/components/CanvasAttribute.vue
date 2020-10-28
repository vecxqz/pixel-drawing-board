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
    <!-- <div class="current-color" :style="currentGirdColor">
      {{ currentGirdColor }}
    </div> -->
    <!-- <div class="color-choose">
      <ul>
        <li
          v-for="color in colors"
          :key="color"
          :style="{ backgroundColor: color, height: '30px', width: '30px' }"
          @click="colorSetByChoose(color)"
        />
      </ul>
    </div> -->
    <!-- <div class="btn-group-operator">
      <div class="btn-operator" @click="redo()">redo</div>
      <div class="btn-operator" @click="undo()">undo</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import layer from "./Layer.vue";
export default {
  name: "CanvasAttribute",
  components: {
    layer
  },
  data() {
    return {
      colors: ["red", "yellow", "blue", "green", "black", "white"]
    };
  },
  computed: {
    girdMeta(this: any) {
      return this.$store.getters["canvasModule/currentGridMeta"];
    },
    previewUrl(this: any) {
      return this.$store.state.canvasModule.previewUrl;
    },
    currentGirdColor(this: any) {
      return `background:${this.$store.getters["canvasModule/currentGridMeta"].color}`;
    },
    width(this: any) {
      const { width, size } = this.$store.state.canvasModule;
      return width / size;
    },
    height(this: any) {
      const { height, size } = this.$store.state.canvasModule;
      return height / size;
    }
  },
  methods: {
    colorSetByChoose(this: any, color: string) {
      this.$store.dispatch("canvasModule/SET_COLOR", color);
    }
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
  width: 200px;
  height: 200px;
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
