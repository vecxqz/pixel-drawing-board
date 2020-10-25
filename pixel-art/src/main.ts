import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { provideStore } from "./composition/useStore";
createApp({
  ...App,
  setup() {
    provideStore(store);
  }
})
  .use(store)
  .use(router)
  .mount("#app");
