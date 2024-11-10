const workerMethods = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  factorial: (a) => {
    let result = 1;
    for (let i = 1; i <= a; i++) {
      result *= i;
    }
    return result;
  },
};
onmessage = (event) => {
  const { data } = event;
  if (!data) {
    throw new Error("No data received");
  }
  if (
    data instanceof Object &&
    data.hasOwnProperty("method") &&
    data.hasOwnProperty("arguments") &&
    data.hasOwnProperty("listener")
  ) {
    const { method, listener, arguments: args } = data;
    if (workerMethods.hasOwnProperty(method)) {
      const result = workerMethods[method].apply(this, args);
      reply(listener, result);
    } else {
      throw new Error("Method not found");
    }
  }
};
function reply(executionListener, ...args) {
  if (!executionListener) {
    throw new Error("No listener found");
  }
  postMessage({ event: executionListener, data: args });
}
