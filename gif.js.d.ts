declare module "gif.js" {
  import { EventEmitter } from "events";

  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: number;
    repeat?: number; // -1 for infinite, 0 for once
  }

  interface FrameOptions {
    delay?: number;
    copy?: boolean;
  }

  export default class GIF extends EventEmitter {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasImageSource | ImageData | CanvasRenderingContext2D,
      options?: FrameOptions
    ): void;
    on(event: "finished", handler: (blob: Blob, data: Uint8Array) => void): void;
    on(event: "progress", handler: (progress: number) => void): void;
    render(): void;
  }
}