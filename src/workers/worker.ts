export type workerMethodsType = "add" | "subtract" | "factorial";

const workerMethods: Record<workerMethodsType, any> = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  factorial: (a: number) => {
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
    const {
      method,
      listener,
      arguments: args,
    } = data as {
      method: workerMethodsType;
      arguments: any[];
      listener: string;
    };
    if (workerMethods.hasOwnProperty(method)) {
      const result = workerMethods[method].apply(this, args);
      reply(listener, result);
    } else {
      throw new Error("Method not found");
    }
  }
};

function reply(executionListener: string, ...args: any) {
  if (!executionListener) {
    throw new Error("No listener found");
  }
  postMessage({ event: executionListener, data: args });
}
