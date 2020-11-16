declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
declare module "color";
declare class GIF {
  constructor(arg: any) {}
  on(lifeCyle: string, hook: any) {}
  addFrame(ctx: any, options: any) {}
  render() {}
}

declare module "uuid";