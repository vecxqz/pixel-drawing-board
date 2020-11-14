import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "./useStore";
import { getGuid, setCanvasData, setPagesData } from "../utils/request/canvas";

import cloneDeep from "lodash/cloneDeep";
export function useFile() {
  const router = useRouter();
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
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
    saveLocal();
  }

  async function saveServer() {
    let { guid, pages } = store.state.canvasModule;
    if (!guid) {
      const { data } = await getGuid();
      guid = data;
      store.state.canvasModule.guid = data.guid;
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
    setPagesData(pagesClone);
    // fetch("/canvas", {
    //   method: "POST",
    //   body: formData
    // })
    //   // request as ArrayBuffer
    //   .then(response => response.arrayBuffer())
    //   .then(buffer => {
    //     console.log(buffer);
    //     // create a new View over our ArrayBuffer
    //     // const data = new Uint8ClampedArray(buffer);
    //     // console.log(data);
    //     // const new_img = new ImageData(data, img.width, img.height);
    //     // return new_img;
    //   });
  }

  function clear() {
    localStorage.removeItem("pages");
  }
  function saveLocal() {
    const { pages } = store.state.canvasModule;
    localStorage.setItem("pages", JSON.stringify(pages));
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
  return { save, loadLocal, clear, saveServer };
}
