// src/declarations.d.ts

declare module 'fluent-ffmpeg' {
  const ffmpeg: any;
  export default ffmpeg;
}

declare module 'ffprobe-static' {
  const ffprobeStatic: {
    path: string;
  };
  export default ffprobeStatic;
}
