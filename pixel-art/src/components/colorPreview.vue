<template>
  <div class="color-preview-container">
    <div
      class="color-primary color-public-attr"
      @click="primaryColorShow"
      :style="`background:${primaryColor}`"
    ></div>
    <div
      class="color-secondary color-public-attr"
      @click="secondaryColorShow"
      :style="`background:${secondaryColor}`"
    ></div>
    <img
      @click="exhcangePsColor"
      src="../assets/double_arrow.svg"
      class="color-ps-exchange"
    />
    <colorPicker
      class="color-primary-choose"
      v-model:visible="primaryColorVisible"
      v-model:emitColor="$store.state.canvasModule.primaryColor"
    />
    <colorPicker
      class="color-secondary-choose"
      v-model:visible="secondaryColorVisible"
      v-model:emitColor="$store.state.canvasModule.secondaryColor"
    />
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../composables/useStore";
import colorPicker from "./colorPicker/main.vue";
export default {
  components: {
    colorPicker
  },
  setup() {
    const store: any = useStore();
    const primaryColorVisible = ref(false);
    const secondaryColorVisible = ref(false);
    const primaryColor = computed(() => store.state.canvasModule.primaryColor);
    const secondaryColor = computed(
      () => store.state.canvasModule.secondaryColor
    );

    function primaryColorShow() {
      primaryColorVisible.value = !primaryColorVisible.value;
      secondaryColorVisible.value = false;
    }
    function secondaryColorShow() {
      secondaryColorVisible.value = !secondaryColorVisible.value;
      primaryColorVisible.value = false;
    }
    function exhcangePsColor() {
      const [newPrimaryColor, newSecondaryColor] = [
        secondaryColor.value,
        primaryColor.value
      ];
      store.dispatch("canvasModule/SET_PRIMARY_COLOR", newPrimaryColor);
      store.dispatch("canvasModule/SET_SECONDARY_COLOR", newSecondaryColor);
    }
    return {
      primaryColorVisible,
      secondaryColorVisible,
      primaryColorShow,
      secondaryColorShow,
      primaryColor,
      secondaryColor,
      exhcangePsColor
    };
  }
};
</script>

<style lang="scss" scoped>
.color {
  &-preview-container {
    position: relative;
  }
  &-public-attr {
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(122, 139, 235, 0.315);
  }
  &-primary {
    z-index: 1;
    margin-left: 15px;
  }
  &-secondary {
    z-index: 0;
    margin-top: -15px;
    margin-left: 40px;
  }
  &-ps-exchange {
    position: relative;
    bottom: 22px;
    left: 14px;
    width: 24px;
    transform: rotate(45deg);
    cursor: pointer;
  }
}
.color {
  &-primary-choose {
    top: 50px;
    left: 16px;
  }
  &-secondary-choose {
    top: 70px;
    left: 40px;
  }
}
</style>
