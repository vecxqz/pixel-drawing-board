<template>
  <div class="register-box">
    <div id="mask"></div>
    <div class="register-container">
      <div>注册</div>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button @click="submitForm" class="btn-register" type="primary"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
      <div class="link-container">
        <router-link :to="{ name: 'Login' }">已有账号直接登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { register } from "../utils/request/user";
import { set } from "js-cookie";
import { useRouter } from "vue-router";
import { Message } from "element-plus/lib/message";

export default {
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const form = reactive({ username: "", password: "" });
    const rules = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      ]
    });
    async function submitForm(event: Event) {
      (formRef.value as any).validate(async (valid: any) => {
        if (valid) {
          try {
            const data = await register(form);
            const {
              msg,
              data: { access_token }
            } = data as any;
            if (access_token) {
              Message({
                type: "success",
                message: msg
              });
              set("token", access_token);
              router.push({ name: "Dashboard" });
            }
          } catch (e) {
            console.log(e);
          }
        }
      });

      event.preventDefault();
    }
    return {
      submitForm,
      register,
      form,
      rules,
      formRef
    };
  }
};
</script>

<style lang="scss" scoped>
.register {
  &-box {
    width: 100%;
    height: 100%;
    background: url(../assets/bg/bg-login.png);
    background-size: cover;
    position: relative;
    z-index: 999;
  }
  &-container {
    width: 350px;
    padding: 10px;
    margin: 30vh auto 0;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 1px 1px 4px 0px #6d6d6d66;
    border-radius: 0.3rem;
    align-items: center;
  }
}
.btn {
  &-item {
    margin-top: 40px;
  }
  &-register {
    width: 220px;
    border-radius: 0.3rem;
    box-shadow: 1px 1px 4px 0px #6d6d6d66;
    text-align: center;
    cursor: pointer;
  }
}
::v-deep(.el-input__inner) {
  width: 220px;
  padding: 0 0 0 10px;
  outline: none;
  border-radius: 0.3rem;
  border: 1px solid #f1f4f7;
  box-shadow: 1px 1px 4px 0px #6d6d6d66;
  background: #f1f4f7;
  &:focus {
    border-color: #409eff;
    outline: 0;
  }
}
#mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -999;
  background-color: rgba(0, 0, 0, 0.65);
}
.link-container {
  width: 100%;
  text-align: right;
  font-size: 14px;
  a {
    text-decoration: none;
    color: #409eff;
  }
}
</style>
