import { workerMethodsType } from "./worker";

export class controlledWorker {
  url: string;
  defaultHandler: () => void;
  errorHandler: () => void;
  listeners: Record<string, any>;
  worker: Worker;
  constructor(
    url: string,
    defaultHandler: () => void,
    errorHandler: () => void
  ) {
    this.url = url;
    this.defaultHandler = defaultHandler ?? (() => {});
    this.errorHandler = errorHandler ?? (() => {});
    this.listeners = {};
    this.worker = new Worker(`/workers/${url}`);

    console.log("Worker created");
    // messsage event handler
    this.worker.onmessage = (event) => {
      const { data } = event;
      if (!data) {
        this.errorHandler();
        return;
      }
      if (
        data instanceof Object &&
        data.hasOwnProperty("event") &&
        data.hasOwnProperty("data")
      ) {
        this.listeners[data.event].apply(this, data.data);
      } else {
        this.defaultHandler.call(data.data);
      }
    };
    this.worker.addEventListener("error", this.errorHandler);
  }

  addListener(event: string, handler: any): void {
    this.listeners[event] = handler;
  }

  removeListener(event: keyof controlledWorker["listeners"]): void {
    delete this.listeners[event];
  }

  execute(method: workerMethodsType, listener: string, ...args: any) {
    this.worker.postMessage({ method, arguments: args, listener });
  }
}
