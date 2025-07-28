import React from "react";

export default function DownloadButtonSkeleton() {
  return (
    <div
      className="
        w-full flex items-center justify-center gap-2
        bg-blue-600 text-white px-4 py-2
        rounded hover:bg-blue-700 transition
      "
    >
      <img
        src="/assets/download.svg"  // Path to the download icon
        alt="Download icon"
        width={18}
        height={18}
        style={{ pointerEvents: "none" }}
      />
      <span>Download</span>
    </div>
  );
}
