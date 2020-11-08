<template>
  <div class="dis-flex pos-absolute container" :class="{ hideen: !visible }">
    <div
      class="color-picker-saturation"
      ref="areaSat"
      :style="`background-color:${chooseColor}`"
    >
      <div class="cursor-sat" :style="satCursorPosition"></div>
    </div>
    <div ref="areaHues">
      <div class="color-picker-hues">
        <div class="cursor-hues" :style="huesCursorPosition"></div>
      </div>
    </div>
    <div class="color-picker-preview">
      <p>新的颜色</p>
      <div class="current-color" :style="`background-color:${newColor}`"></div>
      <div class="choose-color" :style="`background-color:${color}`"></div>
      <p>当前颜色</p>
      <div>h:{{ hues }} s:{{ saturation }} v:{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, takeUntil, tap, map, throttleTime } from "rxjs/operators";
import { useStore } from "../../composables/useStore";
export default {
  props: {
    emitColor: String,
    visible: {
      default: false,
      type: Boolean
    }
  },
  setup(props: any, context: any) {
    const store: any = useStore();
    const color = computed(() => store.state.canvasModule.color);
    const newColor = ref("rgb(0, 0, 0)");
    const chooseColor = ref("");
    const hues = ref(0);
    const saturation = ref(0);
    const value = ref(0);
    const hsv = ref("");
    const areaSat = ref(document.body);
    const areaHues = ref(document.body);
    const satCursorPosition = reactive({ left: "0px", top: "0px" });
    const huesCursorPosition = reactive({ left: "0px", top: "0px" });
    const currentColor = ref("");
    onMounted(() => {
      const satDom = areaSat.value;
      const huesDom = areaHues.value;
      const satDomMouseDown = fromEvent(satDom, "mousedown");
      const satDomMouseMove = fromEvent(document, "mousemove");
      const satDomMouseUp = fromEvent(document, "mouseup");
      const huesDomMouseDown = fromEvent(huesDom, "mousedown");
      const huesDomMouseMove = fromEvent(document, "mousemove");
      const huesDomMouseUp = fromEvent(document, "mouseup");
      // RGBtoHSV()
      const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
      const mColor = matchColors.exec(props.emitColor) as Array<any>;
      const nr = mColor[1],
        ng = mColor[2],
        nb = mColor[3];
      const [r, g, b] = [+nr, +ng, +nb];
      const { h, s, v } = RGBtoHSV(r, g, b);
      const { h: newH, s: newS, l: newL } = HSVtoHSL(h, s, v);
      chooseColor.value = `hsl(${newH}, ${newS * 100}%, ${newL * 100}%)`;
      const satCursorLeft = s * 150;
      const satCursorTop = (1 - v) * 150;
      const hueCursorTop = (1- h/360) * 150;
      satCursorPosition.top = `${satCursorTop - 5}px`;
      satCursorPosition.left = `${satCursorLeft + 5}px`;
      huesCursorPosition.top = `${hueCursorTop}px`;
      currentColor.value = props.emitColor;
      hues.value = h;
      satDomMouseDown
        .pipe(
          tap((e: any) => {
            chooseSat(e);
          }),
          map(() => satDomMouseMove.pipe(takeUntil(satDomMouseUp))),
          throttleTime(16, animationFrameScheduler),
          concatAll()
        )
        .subscribe((e: any) => {
          chooseSat(e);
        });
      huesDomMouseDown
        .pipe(
          tap((e: any) => {
            chooseHues(e);
          }),
          map(() => huesDomMouseMove.pipe(takeUntil(huesDomMouseUp))),
          throttleTime(16, animationFrameScheduler),
          concatAll()
        )
        .subscribe((e: any) => {
          chooseHues(e);
        });
    });
    function chooseSat(e: MouseEvent) {
      const satDom = areaSat.value;
      const { clientX, clientY } = e;
      const { width, height, left, top } = satDom.getBoundingClientRect();
      let cursorLeft, cursorTop;
      if (clientX > left + width) {
        cursorLeft = width;
      } else if (clientX < left) {
        cursorLeft = 0;
      } else {
        cursorLeft = clientX - left;
      }
      if (clientY > top + height) {
        cursorTop = height;
      } else if (clientY < top) {
        cursorTop = 0;
      } else {
        cursorTop = clientY - top;
      }
      saturation.value = Math.round((cursorLeft / width) * 100) / 100;
      value.value = Math.round((1 - cursorTop / height) * 100) / 100;
      satCursorPosition.top = `${cursorTop - 5}px`;
      satCursorPosition.left = `${cursorLeft - 5}px`;
      hsv.value = `${hues.value},${saturation.value},${value.value},`;
      const h = hues.value,
        s = saturation.value,
        v = value.value;
      const { r, g, b } = HSVtoRGB(h, s, v);
      newColor.value = `rgb(${r}, ${g}, ${b})`;
      context.emit("update:emitColor", newColor.value);
    }
    function chooseHues(e: MouseEvent) {
      const huesDom = areaHues.value;
      const { clientY } = e;
      const { height, top } = huesDom.getBoundingClientRect();
      let cursorTop;
      if (clientY > top + height) {
        cursorTop = height;
      } else if (clientY < top) {
        cursorTop = 0;
      } else {
        cursorTop = clientY - top;
      }
      huesCursorPosition.top = `${cursorTop - 4}px`;
      hues.value = Math.round((1 - cursorTop / height) * 360 * 100) / 100;
      const h = hues.value,
        s = saturation.value,
        v = value.value;
      const { h: newH, s: newS, l: newL } = HSVtoHSL(h, s, v);
      const { r, g, b } = HSVtoRGB(h, s, v);
      chooseColor.value = `hsl(${newH}, ${newS * 100}%, ${newL * 100}%)`;
      console.log(chooseColor.value);
      newColor.value = `rgb(${r}, ${g}, ${b})`;
      context.emit("update:emitColor", newColor.value);
    }
    function HSVtoHSL(h: number, s: number, v: number) {
      // both hsv and hsl values are in [0, 1]
      var l = ((2 - s) * v) / 2;

      if (l != 0) {
        if (l == 1) {
          s = 0;
        } else if (l < 0.5) {
          s = (s * v) / (l * 2);
        } else {
          s = (s * v) / (2 - l * 2);
        }
      }

      return {
        h,
        s,
        l
      };
    }
    function HSVtoRGB(h: number, s: number, v: number) {
      let h1 = Math.floor(h / 60) % 6;
      let f = h / 60 - h1;
      let p = v * (1 - s);
      let q = v * (1 - f * s);
      let t = v * (1 - (1 - f) * s);
      let r, g, b;
      switch (h1) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return {
        r: Math.round((r as number) * 255),
        g: Math.round((g as number) * 255),
        b: Math.round((b as number) * 255)
      } as {
        r: number | undefined;
        g: number | undefined;
        b: number | undefined;
      };
    }
    function RGBtoHSL(ar: number, ag: number, ab: number) {
      let r = ar / 255;
      let g = ag / 255;
      let b = ab / 255;

      let min = Math.min(r, g, b);
      let max = Math.max(r, g, b);
      let difference = max - min;
      let h = 0,
        s = 0,
        l = 0;
      if (max == min) {
        h = 0;
        s = 0;
      } else {
        s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min);
        switch (max) {
          case r:
            h = (g - b) / difference + (g < b ? 6 : 0);
            break;
          case g:
            h = 2.0 + (b - r) / difference;
            break;
          case b:
            h = 4.0 + (r - g) / difference;
            break;
        }
        h = Math.round(h * 60);
      }
      return {
        h,
        s,
        l
      };
    }
    function RGBtoHSV(ar: number, ag: number, ab: number) {
      let r = ar / 255;
      let g = ag / 255;
      let b = ab / 255;
      let h = 0,
        s = 0,
        v = 0;
      let min = Math.min(r, g, b);
      let max = (v = Math.max(r, g, b));
      let difference = max - min;

      if (max == min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / difference + (g < b ? 6 : 0);
            break;
          case g:
            h = 2.0 + (b - r) / difference;
            break;
          case b:
            h = 4.0 + (r - g) / difference;
            break;
        }
        h = Math.round(h * 60);
      }
      if (max == 0) {
        s = 0;
      } else {
        s = 1 - min / max;
      }
      return {
        h,
        s,
        v
      };
    }
    return {
      color,
      chooseSat,
      chooseHues,
      chooseColor,
      hues,
      saturation,
      value,
      satCursorPosition,
      areaSat,
      areaHues,
      huesCursorPosition,
      HSVtoRGB,
      RGBtoHSL,
      HSVtoHSL,
      RGBtoHSV,
      newColor
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  background: rgb(190, 737, 417);
  padding: 10px;
}
.pos-absolute {
  position: absolute;
}
.dis-flex {
  display: flex;
}
.color-picker-saturation {
  position: relative;
  width: 150px;
  height: 150px;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(to right, white, transparent);
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(to top, black, transparent);
  }
}
.color-picker-hues {
  position: relative;
  height: 150px;
  width: 15px;
  margin: 0 10px;
  background-image: linear-gradient(
    to top,
    #f00 0%,
    #ff0 16.66%,
    #0f0 33.33%,
    #0ff 50%,
    #00f 66.66%,
    #f0f 83.33%,
    #f00 100%
  );
  background-size: 100% 100%;
}
.color-picker-preview {
  p {
    margin: 0;
    font-size: 12px;
  }
  div {
    width: 50px;
    height: 35px;
  }
}
.cursor-sat {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 4px;
  border: 1px solid black;
  z-index: 1;
  cursor: pointer;
  pointer-events: none;
}
.cursor-hues {
  position: absolute;
  // width: 15px;
  // height: 10px;
  // border: 1px solid black;
  z-index: 1;
  cursor: pointer;
  pointer-events: none;
  &::after {
    content: "";
    position: absolute;
    width: 0;
    left: 12px;
    border-width: 4px;
    border-style: solid;
    border-color: transparent red transparent transparent;
  }
  &::before {
    content: "";
    position: absolute;
    left: -5px;
    width: 0;
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent transparent red;
  }
}
.hideen {
  display: none;
}
</style>
