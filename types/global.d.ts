// types/global.d.ts
declare global {
  interface Window {
    MSStream?: unknown;
  }

  interface Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

export {};
