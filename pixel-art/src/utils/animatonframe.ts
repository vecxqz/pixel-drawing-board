function showProcess(stack: Array<any>, func: Function) {
  const queue = [...stack];
  const frameFunc = func;
  const sortAnimationFrame = function() {
    const args = queue.shift();
    if (args) {
      frameFunc(args);
      requestAnimationFrame(sortAnimationFrame);
    }
  };
  requestAnimationFrame(sortAnimationFrame);
}

export { showProcess };
