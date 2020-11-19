<template>
  <div id="toolbar">
    <div class="title">工具</div>
    <ul class="toolbar-list">
      <el-tooltip
        v-for="(tool, index) in activeTools"
        :key="tool.id"
        :content="tool.title"
      >
        <li
          class="toolbar-item"
          :class="{ active: toolActiveIndex === index }"
          :id="tool.id"
          @click="toolSelect(index, $event)"
        >
          <div class="toolbar-icon"></div>
        </li>
      </el-tooltip>
    </ul>
    <colorPreview class="color-preview" />
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref } from "vue";
import colorPreview from "./colorPreview.vue";
import { useStore } from "../composables/useStore";
export default {
  name: "ToolBar",
  components: {
    colorPreview
  },
  setup() {
    const store: any = useStore();
    const toolActiveIndex = ref(0);
    const tools = reactive([
      {
        id: "tool-pencil",
        title: "画笔工具",
        mode: "pencil",
        active: true
      },
      {
        id: "tool-mirror-pencil",
        title: "镜像工具",
        mode: "mirrorPencil",
        active: true
      },
      {
        id: "tool-eraser",
        title: "橡皮擦工具",
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
        title: "直线工具",
        mode: "line",
        active: true
      },
      {
        id: "tool-square",
        title: "矩形工具",
        mode: "square",
        active: true
      },
      {
        id: "tool-circle",
        title: "圆形工具",
        mode: "circle",
        active: true
      },
      {
        id: "tool-bucket",
        title: "油漆桶工具",
        mode: "bucket",
        active: true
      },
      {
        id: "tool-color-picker",
        title: "吸管工具",
        mode: "colorPicker",
        active: true
      },
      {
        id: "tool-move",
        title: "移动工具",
        mode: "move",
        active: true
      },
      {
        id: "tool-select",
        title: "选择工具",
        mode: "select",
        active: true
      },
      {
        id: "tool-text",
        title: "文本工具",
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
    ]);
    const activeTools = computed(() =>
      tools.filter((tool: any) => tool.active)
    );
    function toolSelect(index: number) {
      toolActiveIndex.value = index;
      store.dispatch(
        "canvasModule/SET_PAINT_MODE",
        activeTools.value[index].mode
      );
    }
    return {
      activeTools,
      toolActiveIndex,
      toolSelect
    };
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
}
#tool-pencil .toolbar-icon {
  background: url(../assets/entypopencil.svg);
}
#tool-mirror-pencil .toolbar-icon {
  background: url(../assets/mirror.svg);
}
#tool-eraser .toolbar-icon {
  background: url(../assets/eraser.svg);
}
// #tool-brush .toolbar-icon {
//   background: url(../assets/brush.svg);
// }
#tool-line .toolbar-icon {
  background: url(../assets/line.svg);
}
#tool-square .toolbar-icon {
  background: url(../assets/square.svg);
}
#tool-circle .toolbar-icon {
  background: url(../assets/radioEmpty.svg);
}
#tool-bucket .toolbar-icon {
  background: url(../assets/bucket.svg);
}
#tool-color-picker .toolbar-icon {
  background: url(../assets/Colorpicker.svg);
}
#tool-move .toolbar-icon {
  background: url(../assets/move.svg);
}
#tool-select .toolbar-icon {
  background: url(../assets/rectangleselection.svg);
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
.color-preview {
  margin-top: 20px;
  z-index: 2;
}
</style>
