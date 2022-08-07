function wait(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export { wait, wait as default };
