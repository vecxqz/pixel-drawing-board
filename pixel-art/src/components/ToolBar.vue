<template>
  <div id="toolbar">
    <div class="title">TOOLS</div>
    <ul class="toolbar-list">
      <li
        class="toolbar-item"
        :class="{ active: toolActiveIndex === index }"
        v-for="(tool, index) in activeTools"
        :title="tool.title"
        :id="tool.id"
        :key="tool.id"
        @click="toolSelect(index, $event)"
      >
        <div class="toolbar-icon"></div>
      </li>
    </ul>
    <colorPreview />
  </div>
</template>

<script lang="ts">
import colorPreview from "./colorPreview.vue";
export default {
  name: "ToolBar",
  components: {
    colorPreview
  },
  computed: {
    activeTools(this: any) {
      return this.tools.filter((tool: any) => tool.active);
    }
  },
  data() {
    return {
      toolActiveIndex: 0,
      tools: [
        {
          id: "tool-pencil",
          title: "Pencil Tool",
          mode: "pencil",
          active: true
        },
        {
          id: "tool-mirror-pencil",
          title: "Mirror Tool",
          mode: "mirrorPencil",
          active: true
        },
        {
          id: "tool-eraser",
          title: "Eraser Tool",
          mode: "eraser",
          active: true
        },
        {
          id: "tool-brush",
          title: "Brush Tool",
          mode: "brush",
          active: false
        },
        {
          id: "tool-line",
          title: "Line Tool",
          mode: "line",
          active: true
        },
        {
          id: "tool-square",
          title: "Square Tool",
          mode: "square",
          active: true
        },
        {
          id: "tool-circle",
          title: "Circle Tool",
          mode: "circle",
          active: true
        },
        {
          id: "tool-bucket",
          title: "Bucket Tool",
          mode: "bucket",
          active: true
        },
        {
          id: "tool-color-picker",
          title: "Color Picker Tool",
          mode: "colorPicker",
          active: true
        },
        {
          id: "tool-move",
          title: "Move Tool",
          mode: "move",
          active: true
        },
        {
          id: "tool-select",
          title: "Select Tool",
          mode: "select",
          active: true
        },
        {
          id: "tool-text",
          title: "Text Tool",
          mode: "text",
          active: false
        },
        {
          id: "tool-lighten-darken",
          title: "Lighten/Darken Tool",
          mode: "lighten/darken",
          active: false
        },
        {
          id: "tool-dithering",
          title: "Dithering Tool",
          mode: "dithering",
          active: false
        },
        {
          id: "tool-stamp",
          title: "Stamp Tool",
          mode: "stamp",
          active: false
        },
        {
          id: "tool-crop",
          title: "Crop Tool - Resize Drawing Canvas",
          mode: "crop",
          active: false
        },
        {
          id: "tool-gradient",
          title: "Gradient Tool",
          mode: "gradient",
          active: false
        }
      ]
    };
  },
  methods: {
    toolSelect(this: any, index: number) {
      this.toolActiveIndex = index;
      this.$store.dispatch(
        "canvasModule/SET_PAINT_MODE",
        this.activeTools[index].mode
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
