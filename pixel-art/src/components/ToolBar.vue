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
    <colorPreview v-if="mode !== 'crop'" class="color-preview" />
    <div v-if="mode === 'crop'">
      <div class="crop-group">
        <div class="crop-item">
          <span>开始X</span><el-input v-model="cropData.startX"></el-input>
        </div>
        <div class="crop-item">
          <span>开始Y</span><el-input v-model="cropData.startY"></el-input>
        </div>
        <div class="crop-item">
          <span>结束X</span><el-input v-model="cropData.endX"></el-input>
        </div>
        <div class="crop-item">
          <span>结束Y</span><el-input v-model="cropData.endY"></el-input>
        </div>
        <el-button type="primary" @click="handleClickCrop()"
          >确定裁剪</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref } from "vue";
import colorPreview from "./colorPreview.vue";
import { useStore } from "../composables/useStore";
import { useCrop } from "../composables/useCrop";
export default {
  name: "ToolBar",
  components: {
    colorPreview
  },
  setup() {
    const store: any = useStore();
    const { cropNewLayer } = useCrop();
    const mode = computed(() => store.state.canvasModule.mode);
    const toolActiveIndex = ref(0);
    const cropData = ref({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    });
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
        title: "裁剪工具 ",
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

    function handleClickCrop() {
      cropNewLayer(cropData.value);
    }

    return {
      activeTools,
      toolActiveIndex,
      toolSelect,
      mode,
      cropData,
      handleClickCrop
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
  background: url(../assets/crop.svg);
}
#tool-gradient .toolbar-icon {
  background-position: -34px -232px;
}
.color-preview {
  margin-top: 20px;
  z-index: 2;
}
.crop-group {
  margin-top: 15px;
  padding: 5px;
  color: #fff;
  .crop-item {
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 12px;
      min-width: 35px;
    }
    ::v-deep(.el-input) {
      width: calc(100% - 40px);
      .el-input__inner {
        height: 25px;
      }
    }
  }
  ::v-deep(.el-button) {
    width: 100%;
  }
}
</style>
