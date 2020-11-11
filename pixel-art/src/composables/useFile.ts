import { computed } from "vue";
import { useStore } from "./useStore";
export function useFile(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  async function save() {
    const { pages } = store.state.canvasModule;
    for (let i = 0; i < pages.length; i++) {
      const {
        imageData: { data, width, height }
      } = pages[i];
      const imageDataString = `[${data.toString()}]`;
      const { layers } = store.state.canvasModule.pages[i];
      store.state.canvasModule.pages[i].imageDataString = imageDataString;
      store.state.canvasModule.pages[i].width = width;
      store.state.canvasModule.pages[i].height = height;
      for (let li = 0; li < layers.length; li++) {
        const {
          canvasImageData: { data, width, height }
        } = layers[li];
        const canvasImageDataString = `[${data.toString()}]`;
        store.state.canvasModule.pages[i].layers[
          li
        ].canvasImageDataString = canvasImageDataString;
        store.state.canvasModule.pages[i].layers[li].width = width;
        store.state.canvasModule.pages[i].layers[li].height = height;
      }
    }
    saveLocal();
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
        updateCanvasImageData(data, imageData);
        pages[i].imageData = imageData;
        pages[i].width = imageData.width;
        pages[i].height = imageData.height;
        for (let li = 0; li < layers.length; li++) {
          const { canvasImageDataString, width, height } = layers[li];
          const canvasImageData = canvasCtx.value.createImageData(
            width,
            height
          );
          const data = new Uint8Array(JSON.parse(canvasImageDataString));
          updateCanvasImageData(data, canvasImageData);
          pages[i].layers[li].canvasImageData = canvasImageData;
          pages[i].layers[li].width = canvasImageData.width;
          pages[i].layers[li].height = canvasImageData.height;
        }
      }
      store.state.canvasModule.pages = pages;
    }
    console.log(pages);
  }
  function updateCanvasImageData(data: any, targetImageData: ImageData) {
    for (let i = 0; i < data.length; i++) {
      targetImageData.data[i] = data[i];
    }
  }
  return { save, loadLocal, clear };
}
