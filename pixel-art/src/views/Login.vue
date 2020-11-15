<template>
  <div>
    <div>
      <div>
        账号：<input
          type="text"
          name="username"
          autocomplete="on"
          v-model="username"
          id="username"
        />
      </div>
      <div>
        密码：<input
          type="password"
          name="password"
          autocomplete="on"
          v-model="password"
          id="password"
        />
      </div>
      <div>
        <div @click="submitForm">登陆</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { login } from "../utils/request/canvas";
import { set } from "js-cookie";
export default {
  setup() {
    const username = ref("");
    const password = ref("");
    async function submitForm(event: Event) {
      console.log(username.value);
      console.log(password.value);
      const data = await login({
        username: username.value,
        password: password.value
      });
      const {
        data: { access_token }
      } = data as any;
      set("token", access_token);
      event.preventDefault();
    }
    return {
      submitForm,
      username,
      password
    };
  }
};
</script>

<style></style>
