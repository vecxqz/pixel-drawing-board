import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: () => ({
    mode: "point"
  }),
  mutations: {
    ...CanvasMutations
  },
  actions: {
    ...CanvasActions
  }
};
export default module;
