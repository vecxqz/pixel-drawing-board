<template>
  <div
    v-clickOutSide="popupHide"
    class="dis-flex pos-absolute container"
    :class="{ hideen: !visible }"
    ref="colrPicker"
  >
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
      <div class="color-group dis-flex">
        <div class="color-item">
          <div
            class="current-color"
            :style="`background-color:${newColor}`"
          ></div>
        </div>
        <div class="color-item">
          <div class="choose-color" :style="`background-color:${color}`"></div>
        </div>
      </div>
      <!-- <div>h:{{ hues }} s:{{ saturation }} v:{{ value }}</div> -->
      <div class="color-meta dis-flex">
        <div class="color-meta-item">
          <div>
            <span>r</span
            ><input @input="rgbInputFilter($event, 'r')" v-model="rgbMeta.r" />
          </div>
          <div>
            <span>g</span
            ><input @input="rgbInputFilter($event, 'g')" v-model="rgbMeta.g" />
          </div>
          <div>
            <span>b</span
            ><input @input="rgbInputFilter($event, 'b')" v-model="rgbMeta.b" />
          </div>
        </div>
        <div class="color-meta-item">
          <div>
            <span>h</span
            ><input @input="hsvInputFilter($event, 'h')" v-model="hues" />
          </div>
          <div>
            <span>s</span
            ><input @input="hsvInputFilter($event, 's')" v-model="saturation" />
          </div>
          <div>
            <span>v</span
            ><input @input="hsvInputFilter($event, 'v')" v-model="value" />
          </div>
        </div>
      </div>
      <div class="color-hex">
        <span>#</span>
        <input @input="hexInputFilter($event)" v-model="colorHex" />
      </div>
      <el-button @click="popupHide" class="btn-sure">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import clickOutSide from "../../directives/clickoutside";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { fromEvent, animationFrameScheduler } from "rxjs";
import { concatAll, takeUntil, tap, map, throttleTime } from "rxjs/operators";
import Color from "color";
interface rgbMeat {
  [key: string]: number;
}
interface SetupPrps {
  [key: string]: unknown;
  emitColor: string;
  visible: boolean;
}
interface SetupContext {
  emit: (event: string, ...args: unknown[]) => void;
}
export default {
  props: {
    emitColor: String,
    visible: {
      default: false,
      type: Boolean
    }
  },
  directives: {
    clickOutSide
  },
  setup(props: SetupPrps, context: SetupContext) {
    const color = computed(() => props.emitColor);
    const newColor = ref("rgb(0, 0, 0)");
    const satWidth = ref(150);
    const satHeight = ref(150);
    const huesHeight = ref(150);
    const chooseColor = ref("");
    const hues = ref(0);
    const saturation = ref(0);
    const value = ref(0);
    const colorHex = ref("");
    const areaSat = ref(document.body);
    const areaHues = ref(document.body);
    const colrPicker = ref(document.body);
    const satCursorPosition = reactive({ left: "0px", top: "0px" });
    const huesCursorPosition = reactive({ left: "0px", top: "0px" });
    const rgbMeta = reactive({ r: 0, g: 0, b: 0 }) as rgbMeat;
    watch(
      () => props.visible,
      () => {
        setBoardView(props.emitColor);
      }
    );
    onMounted(() => {
      const satDom = areaSat.value;
      const huesDom = areaHues.value;
      const colorPickerDom = colrPicker.value;
      const satDomMouseDown = fromEvent(satDom, "mousedown");
      const satDomMouseMove = fromEvent(document, "mousemove");
      const satDomMouseUp = fromEvent(document, "mouseup");
      const huesDomMouseDown = fromEvent(huesDom, "mousedown");
      const huesDomMouseMove = fromEvent(document, "mousemove");
      const huesDomMouseUp = fromEvent(document, "mouseup");
      const colorPickerKeyUp = fromEvent(colorPickerDom, "keyup");
      setBoardView(props.emitColor);
      colorPickerKeyUp.pipe().subscribe(e => {
        e.stopPropagation();
      });
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
      saturation.value = Math.round((cursorLeft / width) * 100);
      value.value = Math.round((1 - cursorTop / height) * 100);
      satCursorPosition.top = `${cursorTop - 5}px`;
      satCursorPosition.left = `${cursorLeft - 5}px`;
      const h = hues.value,
        s = saturation.value,
        v = value.value;
      const [r, g, b] = Color.hsv([h, s, v]).rgb().color;

      rgbMeta.r = Math.round(r);
      rgbMeta.g = Math.round(g);
      rgbMeta.b = Math.round(b);
      colorHex.value = Color.hsv([h, s, v])
        .hex()
        .slice(1);
      // console.log(Color.hsv([h, s, v]));
      newColor.value = `rgb(${rgbMeta.r}, ${rgbMeta.g}, ${rgbMeta.b})`;
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
      hues.value = Math.round((1 - cursorTop / height) * 360);
      const h = hues.value,
        s = saturation.value,
        v = value.value;
      // console.log(h, s, v);
      // console.log(`hsl(${newH}, ${newS}%, ${newL}%)`)
      const [r, g, b] = Color.hsv([h, s, v]).rgb().color;
      // console.log(r, g, b);
      const [newH, newS, newL] = Color.hsv([h, 100, 100]).hsl().color;
      chooseColor.value = `hsl(${newH}, ${newS}%, ${newL}%)`;
      // console.log(r, g, b);
      rgbMeta.r = Math.round(r);
      rgbMeta.g = Math.round(g);
      rgbMeta.b = Math.round(b);
      newColor.value = `rgb(${rgbMeta.r}, ${rgbMeta.g}, ${rgbMeta.b})`;
      colorHex.value = Color.hsv([h, s, v])
        .hex()
        .slice(1);
      context.emit("update:emitColor", newColor.value);
    }

    function popupHide() {
      context.emit("update:visible", false);
    }

    function calcSatCursorPos(color: string) {
      const c = Color(color);
      const hsv = c.hsv().color;
      const s = hsv[1];
      const v = hsv[2];
      const satCursorLeft = (s / 100) * satWidth.value;
      const satCursorTop = (1 - v / 100) * satHeight.value;
      return {
        top: `${satCursorTop - 5}px`,
        left: `${satCursorLeft - 5}px`
      };
    }

    function setBoardView(color: string, { ingoreHex } = { ingoreHex: false }) {
      const c = Color(color);
      const [r, g, b] = c.color;
      const [h, s, v] = c.hsv().color;
      const [newH, newS, newL] = Color.hsv([h, 100, 100]).hsl().color;
      // console.log(newH, newS, newL);
      const { top: satCursorTop, left: satCursorLeft } = calcSatCursorPos(
        color
      );
      const { top: hueCursorTop } = calcHuesCursorPos(color);
      chooseColor.value = `hsl(${newH}, ${newS}%, ${newL}%)`;
      rgbMeta.r = r;
      rgbMeta.g = g;
      rgbMeta.b = b;
      satCursorPosition.top = `${satCursorTop}`;
      satCursorPosition.left = `${satCursorLeft}`;
      huesCursorPosition.top = `${hueCursorTop}`;
      hues.value = Math.round(h);
      saturation.value = Math.round(s);
      value.value = Math.round(v);
      if (!ingoreHex) colorHex.value = c.hex().slice(1);
    }

    function calcHuesCursorPos(color: string) {
      const c = Color(color);
      const [h] = c.hsv().color;
      const hueCursorTop = (1 - h / 360) * huesHeight.value;
      return {
        top: `${hueCursorTop - 4}px`
      };
    }

    function rgbInputFilter(e: any, mode: string) {
      let value = e.target.value;
      if (value.length > 3) {
        value = value.slice(0, 3);
      }
      value = +value.replace(/((?<=\d)\.\d+)|\D/g, "");
      if (value > 255) {
        value = 255;
      }
      if (value === 0) {
        value = 0;
      }
      rgbMeta[mode] = value;
      const { r, g, b } = rgbMeta;
      setBoardView(`rgb(${r}, ${g}, ${b})`);
    }

    function hsvInputFilter(e: any, mode: string) {
      let inputValue = e.target.value;
      if (inputValue.length > 3) {
        inputValue = inputValue.slice(0, 3);
      }
      inputValue = +inputValue.replace(/((?<=\d)\.\d+)|\D/g, "");
      if (mode === "h") {
        if (inputValue > 360) {
          inputValue = 360;
        }
        if (inputValue === 0) {
          inputValue = 0;
        }
        hues.value = inputValue;
      }
      if (mode === "s") {
        if (inputValue > 100) {
          inputValue = 100;
        }
        if (inputValue === 0) {
          inputValue = 0;
        }
        saturation.value = inputValue;
      }
      if (mode === "v") {
        if (inputValue > 100) {
          inputValue = 100;
        }
        if (inputValue === 0) {
          inputValue = 0;
        }
        value.value = inputValue;
      }
      const [r, g, b] = Color.hsv([
        hues.value,
        saturation.value,
        value.value
      ]).rgb().color;
      rgbMeta.r = Math.round(r);
      rgbMeta.g = Math.round(g);
      rgbMeta.b = Math.round(b);
      setBoardView(`rgb(${r}, ${g}, ${b})`);
    }

    function hexInputFilter(e: any) {
      let inputValue = e.target.value;
      let r, g, b;
      // /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
      inputValue = inputValue.replace(/$#?([a-fA-F0-9]{6})/g, "");
      colorHex.value = inputValue;
      inputValue = [...inputValue].filter(w => w !== "#").join("");
      try {
        [r, g, b] = Color(`#${inputValue}`).rgb().color;
        rgbMeta.r = Math.round(r);
        rgbMeta.g = Math.round(g);
        rgbMeta.b = Math.round(b);
        setBoardView(`rgb(${r}, ${g}, ${b})`, { ingoreHex: true });
      } catch (e) {
        (r = 0), (g = 0), (b = 0);
      }
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
      newColor,
      rgbMeta,
      popupHide,
      rgbInputFilter,
      hsvInputFilter,
      colrPicker,
      colorHex,
      hexInputFilter
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  background: #333;
  color: rgb(255, 255, 255);
  user-select: none;
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
.color-group .color-item {
  &:first-of-type {
    margin: 0 5px 0 0;
  }
  p {
    margin: 0;
    font-size: 12px;
  }
  div {
    width: 60px;
    height: 35px;
  }
}
.color-meta {
  &-item {
    &:first-of-type {
      margin: 0 5px 0 0;
    }
    div {
      width: 60px;
      margin: 6px 0;
      span {
        display: inline-block;
        width: 14px;
      }
      input {
        width: 40px;
      }
    }
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
.color-hex {
  span {
    display: inline-block;
    width: 14px;
  }
  input {
    width: 55px;
  }
}
.btn-sure {
  width: 44px;
  height: 20px;
  padding: 2px;
  margin-left: 6px;
}
.hideen {
  display: none;
}
</style>
