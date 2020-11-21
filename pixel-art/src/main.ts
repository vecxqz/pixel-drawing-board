import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { storeTypeKey } from "./store";
import { provideStore } from "./composables/useStore";
import "element-plus/lib/theme-chalk/index.css";
import ElementPlus from "element-plus";
// import installElementPlus from "./plugins/element.js";

const app = createApp({
  ...App,
  setup() {
    provideStore(store);
  }
});

// installElementPlus(app);

app
  .use(store, storeTypeKey)
  .use(router)
  .use(ElementPlus)
  .mount("#app");
