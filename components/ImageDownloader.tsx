"use client";
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import GIF from "gif.js";
import { BannerRef } from "./LedBanner";

interface ImageDownloaderProps {
  targetElementId: string;
  iconPath: string;
  t: (key: string) => string;
  buttonClassName?: string;
  bannerRef?: React.RefObject<BannerRef>;
}

const ImageDownloader: React.FC<ImageDownloaderProps> = ({
                                                           targetElementId,
                                                           iconPath,
                                                           t,
                                                           buttonClassName,
                                                           bannerRef,
                                                         }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // For GIF progress modal
  const [showGifModal, setShowGifModal] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDownloadClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Download PNG
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      // Pause marquee + blink
      if (bannerRef?.current) {
        bannerRef.current.pauseForPng();
      }

      const banner = document.getElementById(targetElementId);
      if (!banner) throw new Error("Element not found");

      const canvas = await html2canvas(banner, {
        useCORS: true,
        scale: 1,
      });

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "banner.png";
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert(t("downloadFailed"));
    } finally {
      // revert states
      if (bannerRef?.current) {
        bannerRef.current.revertPauseForPng();
      }
      setIsDownloading(false);
      setIsMenuOpen(false);
    }
  };

  // Download GIF
  const downloadAsGIF = async () => {
    setIsDownloading(true);
    setShowGifModal(true);
    setGifProgress(0);

    try {
      // Force unpause
      if (bannerRef?.current) {
        bannerRef.current.unpauseForGif();
      }

      const banner = document.getElementById(targetElementId);
      if (!banner) throw new Error("Element not found");

      // Let the marquee animate a bit
      await new Promise((res) => setTimeout(res, 200));

      // 20 frames, each 150ms => ~3s total
      const frameCount = 20;
      const frameDelay = 150;

      // Capture first frame => measure dimension
      const firstCanvas = await html2canvas(banner, { useCORS: true, scale: 1 });
      // Initialize GIF:
      const gif = new GIF({
        workers: 2,
        quality: 20, // bigger number => more compression
        workerScript: "/gif.worker.js",
        width: firstCanvas.width,
        height: firstCanvas.height,
      });

      gif.on("progress", (p: number) => setGifProgress(p));

      // Add the first frame
      gif.addFrame(firstCanvas, { delay: frameDelay });

      // Add subsequent frames
      for (let i = 1; i < frameCount; i++) {
        await new Promise((res) => setTimeout(res, frameDelay));
        const c = await html2canvas(banner, { useCORS: true, scale: 1 });
        gif.addFrame(c, { delay: frameDelay });
      }

      // On finish
      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "banner.gif";
        link.click();
        URL.revokeObjectURL(url);

        // revert unpause
        if (bannerRef?.current) {
          bannerRef.current.revertUnpauseForGif();
        }

        setIsDownloading(false);
        setShowGifModal(false);
        setIsMenuOpen(false);
      });

      gif.render();
    } catch (error) {
      console.error("Download failed:", error);
      alert(t("downloadFailed"));

      if (bannerRef?.current) {
        bannerRef.current.revertUnpauseForGif();
      }
      setIsDownloading(false);
      setShowGifModal(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Download Dropdown */}
      <div className="relative w-full" ref={dropdownRef}>
        <button
          id="download-button"
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className={
            buttonClassName
              ? buttonClassName
              : "w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          }
        >
          <img
            src={iconPath}
            alt="Download the banner"
            width={18}
            height={18}
            style={{ pointerEvents: "none" }}
          />
          <span>{t("download")}</span>
        </button>

        {isMenuOpen && (
          <div className="absolute z-50 mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white border border-gray-700 rounded shadow-lg w-48">
            <button
              onClick={downloadAsPNG}
              disabled={isDownloading}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            >
              {t("downloadAsPNG")}
            </button>
            <button
              onClick={downloadAsGIF}
              disabled={isDownloading}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            >
              {t("downloadAsGIF")}
            </button>
          </div>
        )}
      </div>

      {/* GIF progress modal */}
      {showGifModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[999999] flex items-center justify-center">
          <div className="p-6 bg-white rounded flex flex-col items-center gap-4 min-w-[250px]">
            <p className="text-xl font-semibold text-black">
              {t("generatingGif") || "Generating GIF..."}
            </p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-600 h-3 rounded"
                style={{ width: `${(gifProgress * 100).toFixed(0)}%` }}
              />
            </div>
            <p className="text-sm text-gray-700">
              {Math.round(gifProgress * 100)}%
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDownloader;
