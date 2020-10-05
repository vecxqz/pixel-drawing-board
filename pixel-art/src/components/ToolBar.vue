<template>
  <div class="toolbar">
    <div class="title">TOOLS</div>
    <ul class="toolbar-list">
      <li id="tool-pecil" class="toolbar-item">
        <div class="toolbar-icon" title="Pecil Tool"></div>
      </li>
      <li id="tool-eraser" class="toolbar-item">
        <div class="toolbar-icon" title="Eraser Tool"></div>
      </li>
      <li id="tool-brush" class="toolbar-item">
        <div class="toolbar-icon" title="Brush Tool"></div>
      </li>
      <li id="tool-line" class="toolbar-item">
        <div class="toolbar-icon" title="Line Tool"></div>
      </li>
      <li id="tool-square" class="toolbar-item">
        <div class="toolbar-icon" title="Square Tool"></div>
      </li>
      <li id="tool-circle" class="toolbar-item">
        <div class="toolbar-icon" title="Circle Tool"></div>
      </li>
      <li id="tool-bucket" class="toolbar-item">
        <div class="toolbar-icon" title="Bucket Tool"></div>
      </li>
      <li id="tool-color-picker" class="toolbar-item">
        <div class="toolbar-icon" title="Color Picker Tool"></div>
      </li>
      <li id="tool-move" class="toolbar-item">
        <div class="toolbar-icon" title="Move Tool"></div>
      </li>
      <li id="tool-select" class="toolbar-item">
        <div class="toolbar-icon" title="Select Tool"></div>
      </li>
      <li id="tool-text" class="toolbar-item">
        <div class="toolbar-icon" title="Text Tool"></div>
      </li>
      <li id="tool-lighten-darken" class="toolbar-item">
        <div class="toolbar-icon" title="Lighten/Darken Tool"></div>
      </li>
      <li id="tool-dithering" class="toolbar-item">
        <div class="toolbar-icon" title="Dithering Tool"></div>
      </li>
      <li id="tool-stamp" class="toolbar-item">
        <div class="toolbar-icon" title="Stamp Tool"></div>
      </li>
      <li id="tool-crop" class="toolbar-item">
        <div
          class="toolbar-icon"
          title="Crop Tool - Resize Drawing Canvas"
        ></div>
      </li>
      <li id="tool-gradient" class="toolbar-item">
        <div class="toolbar-icon" title="Gradient Tool"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.toolbar {
  background-color: #333;
  .title {
    color: #fff;
    font-size: 10px;
    text-decoration: none;
    text-transform: uppercase;
    text-align: center;
    padding: 10px 0;
  }
  .toolbar-list {
    display: flex;
    flex-wrap: wrap;
  }
}
.toolbar-item {
  width: 50%;
  height: 52px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.075);
  }
}
.toolbar-icon {
  margin: 10px;
  width: 32px;
  height: 32px;
  background: url(../assets/set_autumnfire.png);
}
#tool-pecil .toolbar-icon {
  background-position: -1px -1px;
}
#tool-eraser .toolbar-icon {
  background-position: -34px -1px;
}
#tool-brush .toolbar-icon {
  background-position: -1px -34px;
}
#tool-line .toolbar-icon {
  background-position: -34px -34px;
}
#tool-square .toolbar-icon {
  background-position: -1px -68px;
}
#tool-circle .toolbar-icon {
  background-position: -34px -68px;
}
#tool-bucket .toolbar-icon {
  background-position: -1px -100px;
}
#tool-color-picker .toolbar-icon {
  background-position: -34px -100px;
}
#tool-move .toolbar-icon {
  background-position: -1px -134px;
}
#tool-select .toolbar-icon {
  background-position: -34px -134px;
}
#tool-text .toolbar-icon {
  background-position: -1px -166px;
}
#tool-lighten-darken .toolbar-icon {
  background-position: -34px -166px;
}
#tool-dithering .toolbar-icon {
  background-position: -1px -200px;
}
#tool-stamp .toolbar-icon {
  background-position: -34px -200px;
}
#tool-crop .toolbar-icon {
  background-position: -1px -232px;
}
#tool-gradient .toolbar-icon {
  background-position: -34px -232px;
}
</style>
