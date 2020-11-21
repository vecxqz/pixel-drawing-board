import { createStore, Store, useStore, Module } from "vuex";
import canvasModule from "./canvas/index";
import { CanvasState } from "./canvas/type";
import { InjectionKey } from "vue";

export interface State {
  canvasModule: CanvasState;
}

export interface Action {}

export const storeTypeKey: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    canvasModule
  }
});

export function useWrapStore() {
  return useStore(storeTypeKey);
}
