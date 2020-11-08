import { useStore } from "./useStore";
export function useDownload() {
  const store: any = useStore();

  function downloadGIF() {
    // const imgs: any = window.document.querySelectorAll(
    //   ".preview-page .page-preview-image"
    // );
    // const GIF = (window as any).GIF;
    // const gif = new GIF({
    //   workers: 4,
    //   quality: 10,
    // });

    // // add an image element
    // imgs.forEach((img: any) =>
    //   gif.addFrame(img, {
    //     delay: 1000
    //   })
    // );
    // gif.on("finished", function(blob: any) {
    //   window.open(URL.createObjectURL(blob));
    // });
    // gif.render();
  }
  return {
    downloadGIF
  };
}
