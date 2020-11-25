import { computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCanvas } from "./useCanvas";
import { usePreview } from "./usePreview";
import { useDoState } from "./useDoState";
import { reactive } from "vue";
import { useWrapStore } from "../store/index";

import {
  getGuid,
  getPagesData,
  setCanvasData,
  setPagesData,
  getCanvasData
} from "../utils/request/canvas";
import cloneDeep from "lodash/cloneDeep";
import { get } from "js-cookie";

export function useFile() {
  const router = useRouter();
  const route = useRoute();
  const { parseBackground } = useCanvas();
  const { clearRedoStack, clearUndoStack } = useDoState();
  const { mergeCanvas } = usePreview();
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const backgroundCanvasCtx = computed(
    () => store.state.canvasModule.backgroundCanvasCtx
  );
  const shadowCanvasCtx = computed(
    () => store.state.canvasModule.shadowLayerCanvasCtx
  );
  const tempCanvasCtx = computed(() => store.state.canvasModule.tempCanvasCtx);
  const belowCanvasCtx = computed(
    () => store.state.canvasModule.belowCanvasCtx
  );
  const aboveCanvasCtx = computed(
    () => store.state.canvasModule.aboveCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  async function save() {
    const { pages } = store.state.canvasModule;
    console.log(pages);
    for (let i = 0; i < pages.length; i++) {
      const {
        imageData: { data, width, height }
      } = pages[i];
      const imageDataString = `[${data.toString()}]`;
      const { layers } = store.state.canvasModule.pages[i];
      store.state.canvasModule.pages[i].imageDataString = imageDataString;
      store.state.canvasModule.pages[i].width = width;
      store.state.canvasModule.pages[i].height = height;
      // store.state.canvasModule.pages[i].imageData = null;
      for (let li = 0; li < layers.length; li++) {
        const {
          imageData: { data, width, height }
        } = layers[li];
        const imageDataString = `[${data.toString()}]`;
        store.state.canvasModule.pages[i].layers[
          li
        ].imageDataString = imageDataString;
        store.state.canvasModule.pages[i].layers[li].width = width;
        store.state.canvasModule.pages[i].layers[li].height = height;
        // store.state.canvasModule.pages[i].layers[li].imageData = null;
      }
    }
    const token = get("token");
    if (token) {
      saveServer();
    } else {
      saveLocal();
    }
  }

  async function saveServer() {
    let { guid, pages, width, height } = store.state.canvasModule;
    if (!guid) {
      const {
        data: { guid: guidServer }
      } = (await getGuid()) as any;
      guid = guidServer;
      store.state.canvasModule.guid = guid;
    }
    router.push({
      name: "DrawPixelDetail",
      params: {
        id: guid
      }
    });
    const pagesClone = cloneDeep(pages);
    const formData = new FormData();
    formData.append(`guid`, guid);
    for (let i = 0; i < pagesClone.length; i++) {
      const {
        imageData: { data, width, height }
      } = pagesClone[i];
      const { layers } = pagesClone[i];
      pagesClone[i].width = width;
      pagesClone[i].height = height;
      formData.append(`pages[${i}].width`, width);
      formData.append(`pages[${i}].height`, height);
      formData.append(`pages[${i}].imageData`, new Blob([data.buffer]));
      pagesClone[i].imageDataString = null;
      pagesClone[i].imageData = null;
      for (let li = 0; li < layers.length; li++) {
        const {
          imageData: { data, width, height }
        } = layers[li];
        formData.append(`pages[${i}].layer[${li}].width`, width);
        formData.append(`pages[${i}].layer[${li}].height`, height);
        formData.append(
          `pages[${i}].layer[${li}].imageData`,
          new Blob([data.buffer])
        );
        pagesClone[i].layers[li].width = width;
        pagesClone[i].layers[li].height = height;
        pagesClone[i].layers[li].imageDataString = null;
        pagesClone[i].layers[li].imageData = null;
      }
    }
    setCanvasData(formData);
    setPagesData({
      canvasId: guid,
      data: {
        title: "untitled",
        width,
        height,
        pages: pagesClone
      }
    });
  }

  function setCanvasSizeData() {
    const { width, height } = store.state.canvasModule;
    if (width === height) {
      store.state.canvasModule.canvasMetaWidth = 800;
      store.state.canvasModule.canvasMetaHeight = 800;
      store.state.canvasModule.size = 800 / width;
    }
    if (width > height) {
      let base = 1;
      store.state.canvasModule.canvasMetaWidth = width;
      store.state.canvasModule.canvasMetaHeight = height;
      while (store.state.canvasModule.canvasMetaWidth < 1400) {
        base++;
        store.state.canvasModule.canvasMetaWidth = width * base;
        store.state.canvasModule.canvasMetaHeight = height * base;
      }
      store.state.canvasModule.size =
        store.state.canvasModule.canvasMetaWidth / width;
    }
    if (width < height) {
      let base = 1;
      store.state.canvasModule.canvasMetaWidth = width;
      store.state.canvasModule.canvasMetaHeight = height;
      while (store.state.canvasModule.canvasMetaHeight < 1400) {
        base++;
        store.state.canvasModule.canvasMetaWidth = width * base;
        store.state.canvasModule.canvasMetaHeight = height * base;
      }
      store.state.canvasModule.size =
        store.state.canvasModule.canvasMetaHeight / height;
    }
  }

  function reset({ width = 40, height = 40 } = {}) {
    console.log(width, height);
    localStorage.removeItem("pages");
    const { width: canvasWidth, height: canvasHeight } = canvasCtx.value.canvas;
    canvasCtx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    shadowCanvasCtx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    tempCanvasCtx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    belowCanvasCtx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    aboveCanvasCtx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    store.state.canvasModule.pages = [];
    store.state.canvasModule.currentPageIndex = 0;
    store.state.canvasModule.currentLayerIndex = 0;
    store.state.canvasModule.pages = [];
    store.state.canvasModule.width = width;
    store.state.canvasModule.height = height;
    clearRedoStack();
    clearUndoStack();
    store.dispatch("canvasModule/CREATE_PAGE");
    nextTick(() => {
      setCanvasSizeData();
      parseBackground(backgroundCanvasCtx.value);
      mergeCanvas();
    });
  }

  function saveLocal() {
    const { pages } = store.state.canvasModule;
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  // https://stackoverflow.com/questions/55620592/react-node-trouble-sending-imagedata-to-server
  async function loadServer() {
    const { params } = route;
    const { id: guid } = params as { id: string };
    const {
      data: { data: pages }
    } = await getPagesData({
      canvasId: guid
    });
    const {
      data: { data: canvasData }
    } = await getCanvasData({
      canvasId: guid
    });
    const { width, height, title, pages: pagesJson } = JSON.parse(pages);
    const o: { pages: any } = { pages: pagesJson };
    for (let i = 0; i < canvasData.length; i++) {
      const {
        width,
        height,
        key,
        data: { data: buffer }
      } = canvasData[i];
      const imgBuffer = new Uint8ClampedArray(buffer);
      const imageData = new ImageData(imgBuffer, width, height);
      // o.[`${key}`].imaegData = imageData;
      const { type, pageIndex, layerIndex } = JSON.parse(key);
      if (type === "page") {
        o.pages[+`${pageIndex}`].imageData = imageData;
      }
      if (type === "layer") {
        o.pages[+`${pageIndex}`].layers[+`${layerIndex}`].imageData = imageData;
      }
    }
    store.state.canvasModule.width = width;
    store.state.canvasModule.height = height;
    store.state.canvasModule.guid = guid;
    store.state.canvasModule.pages = o.pages;
  }

  function loadLocal() {
    const pages = JSON.parse(localStorage.getItem("pages") as string);
    if (pages) {
      for (let i = 0; i < pages.length; i++) {
        const { imageDataString, width, height, layers } = pages[i];
        const imageData = canvasCtx.value.createImageData(width, height);
        const data = new Uint8Array(JSON.parse(imageDataString));
        updateimageData(data, imageData);
        pages[i].imageData = imageData;
        pages[i].width = imageData.width;
        pages[i].height = imageData.height;
        for (let li = 0; li < layers.length; li++) {
          const { imageDataString, width, height } = layers[li];
          const imageData = canvasCtx.value.createImageData(width, height);
          const data = new Uint8Array(JSON.parse(imageDataString));
          updateimageData(data, imageData);
          pages[i].layers[li].imageData = imageData;
          pages[i].layers[li].width = imageData.width;
          pages[i].layers[li].height = imageData.height;
        }
      }
      store.state.canvasModule.pages = pages;
    }
    console.log(pages);
  }

  function updateimageData(data: any, targetImageData: ImageData) {
    for (let i = 0; i < data.length; i++) {
      targetImageData.data[i] = data[i];
    }
  }
  
  return {
    save,
    loadLocal,
    loadServer,
    reset,
    saveServer,
    setCanvasSizeData
  };
}
