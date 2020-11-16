import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { provideStore } from "./composables/useStore";

import "element3/lib/theme-chalk/index.css";
import Element3 from "element3";

createApp({
  ...App,
  setup() {
    provideStore(store);
  }
})
  .use(store)
  .use(router)
  .use(Element3)
  .mount("#app");
