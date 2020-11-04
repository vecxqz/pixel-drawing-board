import { computed, toRaw } from "vue";
import { useStore } from "./useStore";

export function useCanvas() {
  function createImageData(width: number, height: number) {
    return new ImageData(width, height);
  }
  function calcColor(
    imageData: ImageData,
    columnIndex: number,
    rowIndex: number
  ) {
    const { height, data } = imageData;
    // console.log(
    //   `
    //    columnIndex ${columnIndex}, 
    //    rowIndex ${rowIndex},
    //    height ${height},
    //   `
    // );
    const index = (columnIndex + rowIndex * height) * 4;
    // console.log(index);
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3] / 255;
    const hex = RGBToHex(r, g, b);
    return {
      r,
      g,
      b,
      a,
      hex,
      rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
      rgb: `rgb(${r}, ${g}, ${b})`
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
  function RGBToHex(argR: number, argG: number, argB: number) {
    let r: string = argR.toString(16),
      g: string = argG.toString(16),
      b: string = argB.toString(16);

    if (r.length == 1) r = `0${r}`;
    if (g.length == 1) g = `0${g}`;
    if (b.length == 1) b = `0${b}`;

    return "#" + r + g + b;
  }
  return { createImageData, calcColor };
}
