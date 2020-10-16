<template>
  <div class="tools">
    <div v-if="girdMeta">{{ girdMeta }}</div>
    <div class="current-color" :style="currentGirdColor">
      {{ currentGirdColor }}
    </div>
    <div class="color-choose">
      <ul>
        <li
          v-for="color in colors"
          :key="color"
          :style="{ backgroundColor: color, height: '30px', width: '30px' }"
          @click="colorSetByChoose(color)"
        />
      </ul>
    </div>
    <!-- <div class="btn-group-operator">
      <div class="btn-operator" @click="redo()">redo</div>
      <div class="btn-operator" @click="undo()">undo</div>
    </div> -->
  </div>
</template>

<script lang="ts">
export default {
  name: "CanvasAttribute",
  data() {
    return {
      colors: ["red", "yellow", "blue", "green", "black", "white"]
    };
  },
  computed: {
    girdMeta(this: any) {
      return this.$store.getters["canvasModule/currentGridMeta"];
    },
    currentGirdColor(this: any) {
      return `background:${this.$store.getters["canvasModule/currentGridMeta"].color}`;
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
  margin-left: 10px;
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
</style>
