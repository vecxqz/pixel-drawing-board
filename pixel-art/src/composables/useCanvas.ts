import { computed, toRaw } from "vue";
import { useStore } from "./useStore";

export function useCanvas() {
  function createImageData(width: number, height: number) {
    return new ImageData(width, height);
  }
  function calcColor(imageData: ImageData, columnIndex: number, row: number) {
    const { width, data } = imageData;
    const r = data[columnIndex * 4 + row * width + 0];
    const g = data[columnIndex * 4 + row * width + 1];
    const b = data[columnIndex * 4 + row * width + 2];
    const a = data[columnIndex * 4 + row * width + 3] / 255;
    const hex = RGBAToHexA(r, g, b, a);
    return {
      r,
      g,
      b,
      a,
      hex,
      rgba: `(${r},${g},${b},${a})`
    };
  }
  function RGBAToHexA(argR: number, argG: number, argB: number, argA: number) {
    let r: string = argR.toString(16),
      g: string = argG.toString(16),
      b: string = argB.toString(16),
      a: string = Math.round(argA * 255).toString(16);

    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;
    if (a.length == 1) a = `0${a}`;

    return "#" + r + g + b + a;
  }

  return { createImageData, calcColor };
}
