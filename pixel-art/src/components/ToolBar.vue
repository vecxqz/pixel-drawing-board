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
          id: "tool-pecil",
          title: "Pecil Tool"
        },
        {
          id: "tool-eraser",
          title: "Eraser Tool"
        },
        {
          id: "tool-brush",
          title: "Brush Tool"
        },
        {
          id: "tool-line",
          title: "Line Tool"
        },
        {
          id: "tool-square",
          title: "Square Tool"
        },
        {
          id: "tool-circle",
          title: "Circle Tool"
        },
        {
          id: "tool-bucket",
          title: "Bucket Tool"
        },
        {
          id: "tool-color-picker",
          title: "Color Picker Tool"
        },
        {
          id: "tool-move",
          title: "Move Tool"
        },
        {
          id: "tool-select",
          title: "Select Tool"
        },
        {
          id: "tool-text",
          title: "Text Tool"
        },
        {
          id: "tool-lighten-darken",
          title: "Lighten/Darken Tool"
        },
        {
          id: "tool-dithering",
          title: "Dithering Tool"
        },
        {
          id: "tool-stamp",
          title: "Stamp Tool"
        },
        {
          id: "tool-crop",
          title: "Crop Tool - Resize Drawing Canvas"
        },
        {
          id: "tool-gradient",
          title: "Gradient Tool"
        }
      ]
    };
  },
  methods: {
    toolSelect(index) {
      this.toolActiveIndex = index;
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
