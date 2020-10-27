<template>
  <div class="color-preview-container">
    <div
      class="color-primary color-public-attr"
      :style="`background:${primaryColor}`"
    ></div>
    <div
      class="color-secondary color-public-attr"
      :style="`background:${secondaryColor}`"
    ></div>
    <img
      @click="exhcangePsColor"
      src="../assets/double_arrow.svg"
      class="color-ps-exchange"
    />
  </div>
</template>

<script>
export default {
  computed: {
    primaryColor() {
      return this.$store.state.canvasModule.primaryColor;
    },
    secondaryColor() {
      return this.$store.state.canvasModule.secondaryColor;
    }
  },
  methods: {
    exhcangePsColor() {
      const [newPrimaryColor, newSecondaryColor] = [
        this.secondaryColor,
        this.primaryColor
      ];
      this.$store.dispatch("canvasModule/SET_PRIMARY_COLOR", newPrimaryColor);
      this.$store.dispatch("canvasModule/SET_SECONDARY_COLOR", newSecondaryColor);
    }
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
    bottom: 24px;
    left: -22px;
    width: 24px;
    transform: rotate(45deg);
    cursor: pointer;
  }
}
</style>
