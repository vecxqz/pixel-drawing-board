// https://v3.cn.vuejs.org/guide/migration/custom-directives.html
export default {
  beforeMount(el: any, binding: any, vnode: any, prevVnode: any) {
    console.log(el);
    console.log(binding);
    console.log(vnode);
    console.log(prevVnode);
    const { value, instance } = binding;
    console.log(value, instance);
  }
};
