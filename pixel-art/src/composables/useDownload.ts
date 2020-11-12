import { computed, nextTick } from "vue";
import { useStore } from "./useStore";
export function useDownload() {
  const store: any = useStore();
  const tempCanvasCtx = computed(() => store.state.canvasModule.tempCanvasCtx);
  const currentPageIndex = computed(
    () => store.state.canvasModule.currentPageIndex
  );
  const currentPage = computed(
    () => store.state.canvasModule.pages[currentPageIndex.value]
  );
  const animationSpeed = computed(
    () => store.state.canvasModule.animationSpeed
  );
  function getDownloadImageBlob() {
    // console.log(tempCanvasCtx.value);
    const { pages, currentPageIndex } = store.state.canvasModule;
    const { width, height } = tempCanvasCtx.value.canvas;
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    const { imageData } = pages[currentPageIndex];
    const scale = 10;
    const scaleImageDataResult = scaleImageData(
      imageData,
      scale,
      tempCanvasCtx.value
    );
    tempCanvasCtx.value.canvas.width = width * scale;
    tempCanvasCtx.value.canvas.height = height * scale;
    tempCanvasCtx.value.putImageData(scaleImageDataResult, 0, 0);
    const url = tempCanvasCtx.value.canvas.toDataURL("image/png", 1);
    tempCanvasCtx.value.canvas.width = width;
    tempCanvasCtx.value.canvas.height = height;
    return fetch(url).then(res => res.blob());
  }
  function getImage(imageData: ImageData, scale: number) {
    const { width, height } = tempCanvasCtx.value.canvas;
    tempCanvasCtx.value.clearRect(0, 0, width, height);
    const scaleImageDataResult = scaleImageData(
      imageData,
      scale,
      tempCanvasCtx.value
    );
    tempCanvasCtx.value.canvas.width = width * scale;
    tempCanvasCtx.value.canvas.height = height * scale;
    tempCanvasCtx.value.putImageData(scaleImageDataResult, 0, 0);
    const url = tempCanvasCtx.value.canvas.toDataURL("image/png", 1);
    const img = document.createElement("img");
    document.body.appendChild(img);
    img.style.position = "fixed";
    img.style.left = "0";
    img.style.top = "0";
    img.style.zIndex = "-99";
    img.src = url;
    tempCanvasCtx.value.canvas.width = width;
    tempCanvasCtx.value.canvas.height = height;
    return new Promise(resolve => {
      img.onload = () => {
        resolve(img);
      };
    });
  }
  /* https://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas */
  function scaleImageData(
    imageData: ImageData,
    scale: number,
    canvasCtx: CanvasRenderingContext2D
  ) {
    var scaled = canvasCtx.createImageData(
      imageData.width * scale,
      imageData.height * scale
    );
    for (var row = 0; row < imageData.height; row++) {
      for (var col = 0; col < imageData.width; col++) {
        var sourcePixel = [
          imageData.data[(row * imageData.width + col) * 4 + 0],
          imageData.data[(row * imageData.width + col) * 4 + 1],
          imageData.data[(row * imageData.width + col) * 4 + 2],
          imageData.data[(row * imageData.width + col) * 4 + 3]
        ];
        for (var y = 0; y < scale; y++) {
          var destRow = row * scale + y;
          for (var x = 0; x < scale; x++) {
            var destCol = col * scale + x;
            for (var i = 0; i < 4; i++) {
              scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                sourcePixel[i];
            }
          }
        }
      }
    }

    return scaled;
  }
  function downloadImage() {
    getDownloadImageBlob().then(blob => {
      createDownload(`image${Math.random() * 100}.png`, blob);
    });
  }
  function downloadImageGIF() {
    var gif = new GIF({
      workers: 2,
      quality: 10
    });

    const pages = store.state.canvasModule.pages;
    const imgs = [];
    for (let i = 0; i < pages.length; i++) {
      const { imageData } = pages[i];
      const imgPromise = getImage(imageData, 20);
      imgs.push(imgPromise);
    }
    Promise.all(imgs).then(imgs => {
      imgs.forEach(img => gif.addFrame(img, { delay: animationSpeed.value }));
      gif.render();
      imgs.forEach((img: any) => document.body.removeChild(img));
    });
    gif.on("finished", function(blob: any) {
      // window.open(URL.createObjectURL(blob));
      createDownload(`image${Math.random() * 100}.gif`, blob);
    });
  }
  function createDownload(fileName: string, blob: any) {
    const aTag = document.createElement("a");
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    console.log(URL.createObjectURL(blob));
    aTag.click();
    URL.revokeObjectURL(blob);
  }
  return {
    downloadImage,
    getDownloadImageBlob,
    downloadImageGIF
  };
}
