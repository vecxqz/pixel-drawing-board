<template>
  <div id="toolbar">
    <div class="title">TOOLS</div>
    <ul class="toolbar-list">
      <li
        class="toolbar-item"
        :class="{ active: toolActiveIndex === index }"
        v-for="(tool, index) in tools"
        :title="tool.title"
        :id="tool.id"
        :key="tool.id"
        @click="toolSelect(index, $event)"
      >
        <div class="toolbar-icon"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  data() {
    return {
      toolActiveIndex: 0,
      tools: [
        {
          id: "tool-pencil",
          title: "Pencil Tool",
          mode: "pencil"
        },
        {
          id: "tool-eraser",
          title: "Eraser Tool",
          mode: "eraser"
        },
        {
          id: "tool-brush",
          title: "Brush Tool",
          mode: "brush"
        },
        {
          id: "tool-line",
          title: "Line Tool",
          mode: "line"
        },
        {
          id: "tool-square",
          title: "Square Tool",
          mode: "square"
        },
        {
          id: "tool-circle",
          title: "Circle Tool",
          mode: "circle"
        },
        {
          id: "tool-bucket",
          title: "Bucket Tool",
          mode: "bucket"
        },
        {
          id: "tool-color-picker",
          title: "Color Picker Tool",
          mode: "colorPicker"
        },
        {
          id: "tool-move",
          title: "Move Tool",
          mode: "move"
        },
        {
          id: "tool-select",
          title: "Select Tool",
          mode: "select"
        },
        {
          id: "tool-text",
          title: "Text Tool",
          mode: "text"
        },
        {
          id: "tool-lighten-darken",
          title: "Lighten/Darken Tool",
          mode: "lighten/darken"
        },
        {
          id: "tool-dithering",
          title: "Dithering Tool",
          mode: "dithering"
        },
        {
          id: "tool-stamp",
          title: "Stamp Tool",
          mode: "stamp"
        },
        {
          id: "tool-crop",
          title: "Crop Tool - Resize Drawing Canvas",
          mode: "crop"
        },
        {
          id: "tool-gradient",
          title: "Gradient Tool",
          mode: "gradient"
        }
      ]
    };
  },
  methods: {
    toolSelect(index) {
      this.toolActiveIndex = index;
      this.$store.dispatch(
        "canvasModule/SET_PAINT_MODE",
        this.tools[index].mode
      );
    }
  }
};
</script>

<style lang="scss" scoped>
#toolbar {
  border-top: 1px solid rgba(0, 0, 0, 0.5);
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
  &.active {
    background-color: rgba(37, 138, 224, 1);
  }
}
.toolbar-icon {
  margin: 10px;
  width: 32px;
  height: 32px;
  background: url(../assets/set_autumnfire.png);
}
#tool-pencil .toolbar-icon {
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
