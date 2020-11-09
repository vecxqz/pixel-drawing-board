// const isServer = Vue.prototype.$isServer
const isServer = false;
/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();
