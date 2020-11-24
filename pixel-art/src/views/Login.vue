<template>
  <div class="login-box">
    <div id="mask"></div>
    <div class="login-container">
      <div v-op="'login'">登录</div>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="你的账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button @click="submitForm" class="btn-login" type="primary"
            >登录</el-button
          >
          <el-button @click="toRegisterView" class="btn-register"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { login } from "../utils/request/user";
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
            const data = await login(form);
            const {
              msg,
              data: { access_token }
            } = data as any;
            if (access_token) {
              Message({
                type: "success",
                message: msg
              });
              // (Message as any).success(msg);
              set("token", access_token);
              // router.push({ path: "/dashboard" });
              router.push({
                name: "Dashboard"
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      });

      event.preventDefault();
    }
    async function toRegisterView() {
      router.push({
        name: "Register"
      });
    }
    return {
      submitForm,
      toRegisterView,
      form,
      rules,
      formRef
    };
  }
};
</script>

<style lang="scss" scoped>
.login {
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
  &-login,
  &-register {
    width: 105px;
    border-radius: 0.3rem;
    box-shadow: 1px 1px 4px 0px #6d6d6d66;
    text-align: center;
    cursor: pointer;
  }
}
::v-deep .el-input__inner {
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
</style>
