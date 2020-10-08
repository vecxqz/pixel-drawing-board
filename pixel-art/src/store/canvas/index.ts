import { CanvasMutations } from "./mutations";
import { CanvasActions } from "./actions";
import { Module } from "vuex";
import { CanvasState } from "./type";
const module: Module<CanvasState, any> = {
  namespaced: true,
  state: () => ({
    mode: "point",
    currentLayerIndex: 0,
    currentPageIndex: 0,
    pages: [],
    width: 800,
    height: 800
  }),
  mutations: {
    ...CanvasMutations
  },
  actions: {
    ...CanvasActions
  }
};
export default module;
