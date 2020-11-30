<template>
  <div class="project-data">
    <el-card
      class="project-item"
      v-for="(project, index) in projectList"
      :key="project.guid"
    >
      <div v-if="project.data">
        <img
          class="cur-pointer"
          @click="openPorjectPage(project.guid)"
          :src="project.data.pages[0].previewUrl"
          alt=""
          srcset=""
        />
        <div class="project-title">
          <div
            v-if="!project.edit"
            class="cur-pointer"
            @click="openPorjectPage(project.guid)"
          >
            {{ project.data.title }}
          </div>
          <el-input
            v-if="project.edit"
            ref="elInputRef"
            @blur="handleEditBlur($event, index)"
            @keyup.enter="handleEditEnter($event, index)"
            v-model="project.data.title"
            :autofocus="true"
          ></el-input>
          <div class="op-group">
            <el-tooltip content="重命名">
              <el-button
                type="primary"
                size="mini"
                class="btn-rename"
                icon="el-icon-edit"
                @click="changeToEditStatus(index)"
                circle
              ></el-button>
            </el-tooltip>
            <el-popconfirm
              title="确定删除该工程？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="remove($event, project.guid)"
            >
              <template #reference>
                <span>
                  <el-tooltip content="删除工程">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      circle
                    ></el-button>
                  </el-tooltip>
                </span>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getAllPagesData,
  removePagesData,
  setPageTitle
} from "../../utils/request/canvas";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const projectList = ref([{}]);
    const elInputRef = ref(null);
    const router = useRouter();

    onMounted(async () => {
      await parseProjectList();
    });

    async function parseProjectList() {
      const {
        data: { data }
      } = await getAllPagesData();
      projectList.value = (data as Array<any>).map((d: any) => {
        const data = JSON.parse(d.data);
        return {
          ...d,
          data: data,
          edit: false,
          preTitle: data.title
        };
      });
    }

    async function remove(event: Event, guid: string) {
      const { code, msg } = (await removePagesData(guid)) as any;
      if (code === 200) {
        ElMessage({
          type: "success",
          message: msg
        });
        await parseProjectList();
      }
    }

    async function handleEditBlur(event: Event, index: number) {
      const { preTitle } = projectList.value[index] as any;
      const title = (event.target as any).value;
      if (title !== preTitle) {
        const { msg, code } = (await setPageTitle({
          title: title,
          guid: (projectList.value[index] as any).guid
        })) as any;
        if (code === 200) {
          ElMessage({
            type: "success",
            message: msg
          });
        }
      }
      (projectList.value[index] as any).edit = false;
    }
    function handleEditEnter() {
      nextTick(() => {
        const el = elInputRef.value as any;
        el.blur();
      });
    }

    function changeToEditStatus(index: number) {
      (projectList.value[index] as any).edit = true;
      nextTick(() => {
        const el = elInputRef.value as any;
        console.log(el);
        el.focus();
      });
    }

    async function openPorjectPage(guid: number) {
      const url = await router.resolve({
        name: "DrawPixelDetail",
        params: {
          id: guid
        }
      });
      window.open(url.href, "_blank");
    }

    return {
      projectList,
      remove,
      handleEditBlur,
      changeToEditStatus,
      handleEditEnter,
      openPorjectPage,
      elInputRef
    };
  }
};
</script>

<style lang="scss" scoped>
.project {
  &-data {
    display: flex;
    flex-wrap: wrap;
  }
  &-item {
    flex: 0;
    margin: 10px;
    a {
      text-decoration: none;
    }
    img {
      // width: 200px;
      min-height: 200px;
      image-rendering: pixelated;
    }
  }
  &-title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    a {
      color: black;
    }
    ::v-deep(.el-input) {
      width: calc(100% - 80px);
    }
    .op-group {
      width: 70px;
    }
  }
}

::v-deep(.el-card__body) {
  padding: 0;
}
.cur-pointer {
  cursor: pointer;
}
.btn-rename {
  margin-right: 5px;
}
</style>
