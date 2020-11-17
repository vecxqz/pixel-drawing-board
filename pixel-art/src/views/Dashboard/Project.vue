<template>
  <div class="project-data">
    <el-card
      class="project-item"
      v-for="project in projectList"
      :key="project.guid"
    >
      <div v-if="project.data">
        <router-link
          :to="{ name: 'DrawPixelDetail', params: { id: project.guid } }"
        >
          <img :src="project.data.pages[0].previewUrl" alt="" srcset="" />
          <div class="project-title">{{ project.data.title }}</div>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { getAllPagesData } from "../../utils/request/canvas";
export default {
  setup() {
    const projectList = ref([{}]);
    onMounted(async () => {
      const {
        data: { data }
      } = await getAllPagesData();
      projectList.value = (data as Array<any>).map((d: any) => {
        return {
          ...d,
          data: JSON.parse(d.data)
        };
      });
      console.log(projectList.value);
    });
    return { projectList };
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
    padding: 5px;
    text-align: center;
    color: black;
  }
}
::v-deep .el-card__body {
  padding: 0;
}
</style>
