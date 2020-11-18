<template>
  <div class="project-data">
    <el-card
      class="project-item"
      v-for="(project, index) in projectList"
      :key="project.guid"
    >
      <div v-if="project.data">
        <router-link
          :to="{ name: 'DrawPixelDetail', params: { id: project.guid } }"
        >
          <img :src="project.data.pages[0].previewUrl" alt="" srcset="" />
        </router-link>
        <div class="project-title">
          <router-link
            v-if="!project.edit"
            :to="{ name: 'DrawPixelDetail', params: { id: project.guid } }"
          >
            {{ project.data.title }}
          </router-link>
          <el-input
            v-if="project.edit"
            ref="elInputRef"
            @blur="handleEditBlur($event, index)"
            @keyup.enter="handleEditEnter($event, index)"
            v-model="project.data.title"
            :autofocus="true"
          ></el-input>
          <div class="op-group">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="changeToEditStatus(index)"
              circle
            ></el-button>
            <el-popconfirm
              title="确定删除该工程？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="remove($event, project.guid)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  circle
                ></el-button>
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
import {
  getAllPagesData,
  removePagesData,
  setPageTitle
} from "../../utils/request/canvas";
import { Message } from "element-plus/lib/message";
export default {
  setup() {
    const projectList = ref([{}]);
    const elInputRef = ref(null);

    onMounted(async () => {
      await parseProjectList();
    });

    async function parseProjectList() {
      const {
        data: { data }
      } = await getAllPagesData();
      projectList.value = (data as Array<any>).map((d: any) => {
        return {
          ...d,
          data: JSON.parse(d.data),
          edit: false
        };
      });
    }

    async function remove(event: Event, guid: string) {
      const { code, msg } = (await removePagesData(guid)) as any;
      if (code === 200) {
        Message({
          type: "success",
          message: msg
        });
        await parseProjectList();
      }
    }

    async function handleEditBlur(event: Event, index: number) {
      const { msg, code } = (await setPageTitle({
        title: (event.target as any).value,
        guid: (projectList.value[index] as any).guid
      })) as any;
      if (code === 200) {
        Message({
          type: "success",
          message: msg
        });
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
        el.focus();
      });
    }

    return {
      projectList,
      remove,
      handleEditBlur,
      changeToEditStatus,
      handleEditEnter,
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
      width: calc(100% - 90px);
    }
    .op-group {
      width: 70px;
    }
  }
}

::v-deep .el-card__body {
  padding: 0;
}
</style>
