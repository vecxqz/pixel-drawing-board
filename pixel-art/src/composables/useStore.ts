import { RootState } from "@/store/type";
import { provide, inject } from "vue";
const StoreSymbol = Symbol();

export function provideStore(store: any) {
  provide(StoreSymbol, store);
}

export function useStore() {
  const store = inject(StoreSymbol);
  if (!store) {
    // 抛出错误，不提供 store
  }

  return store;
}
