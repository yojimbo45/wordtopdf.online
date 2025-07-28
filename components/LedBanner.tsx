"use client";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import dynamic from "next/dynamic";
import DownloadButtonSkeleton from "@/skeleton/DownloadButtonSkeleton";

/** Methods the downloader will call: */
export interface BannerRef {
  pauseForPng: () => void;
  revertPauseForPng: () => void;
  unpauseForGif: () => void;
  revertUnpauseForGif: () => void;
}

interface LedBannerProps {
  locale: string;
  translations: Record<string, string>;
}

/** Icon paths, etc. */
const ICON_PATHS = {
  fullscreen: "/assets/full-screen.svg",
  borderMode: "/assets/animate-border.svg",
  borderColor: "/assets/border-color.svg",
  fontColor: "/assets/font-color.svg",
  bgColor: "/assets/background-color.svg",
  fontSize: "/assets/font-size.svg",
  direction: "/assets/direction.svg",
  blink: "/assets/blink.svg",
  leftArrow: "/assets/left-arrow.svg",
  rightArrow: "/assets/right-arrow.svg",
  play: "/assets/play.svg",
  stop: "/assets/pause.svg",
  fontFamily: "/assets/font-family.svg",
  download: "/assets/download.svg",
};

/** Dynamically load the ImageDownloader with a skeleton fallback. */
const LazyImageDownloader = dynamic(() => import("./ImageDownloader"), {
  ssr: false,
  loading: () => <DownloadButtonSkeleton />,
});

const LedBanner = forwardRef<BannerRef, LedBannerProps>(function LedBannerRef(
  { locale, translations },
  ref
) {
  /** A small helper for translations. */
  const t = (key: string) => translations[key] || key;

  // ─────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────
  const [bannerText, setBannerText] = useState("HELLO😍🥰");
  const [fontSize, setFontSize] = useState(310);
  const [textColor, setTextColor] = useState("#FF007A");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [isBold, setIsBold] = useState(true);

  // Blink
  const [blinkEnabled, setBlinkEnabled] = useState(true);
  const [isBlinkVisible, setIsBlinkVisible] = useState(true);

  // Manual marquee
  const [speed, setSpeed] = useState(14);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isStopped, setIsStopped] = useState(false);
  const [offsetX, setOffsetX] = useState(1000);
  const [textScale, setTextScale] = useState(1);

  // Border mode
  const [isBorderModeEnabled, setIsBorderModeEnabled] = useState(true);
  const [dynamicColor1, setDynamicColor1] = useState("#FF0000");
  const [dynamicColor2, setDynamicColor2] = useState("#EE00FF");
  const [dynamicColor3, setDynamicColor3] = useState("#FBFF00");

  // For reverting after PNG/GIF capture
  const previousStatesRef = useRef({ wasStopped: false, wasBlinking: true });

  // Refs for measuring container + text on pause
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // For unpause revert
  const oldOffsetRef = useRef(offsetX);
  const oldScaleRef = useRef(textScale);

  // ─────────────────────────────────────────────────────────────────
  //  DYNAMIC RATIO (key to avoid distortion on resizing)
  // ─────────────────────────────────────────────────────────────────
  const [imageRatio, setImageRatio] = useState(1.75); // fallback ratio if image not loaded
  useEffect(() => {
    const img = new Image();
    img.src = "/background_led.webp";
    img.onload = () => {
      if (img.width && img.height) {
        setImageRatio(img.width / img.height);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // 1) Manual marquee using requestAnimationFrame
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let frameId: number;

    function animate() {
      if (!isStopped) {
        setOffsetX((prev) =>
          direction === "left" ? prev - speed : prev + speed
        );
      }
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [direction, speed, isStopped]);

  // Wrap around if text goes too far off screen
  useEffect(() => {
    if (offsetX < -3000) {
      setOffsetX(1500);
    } else if (offsetX > 3000) {
      setOffsetX(-1500);
    }
  }, [offsetX]);

  // ─────────────────────────────────────────────────────────────────
  // 2) Manual blink
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!blinkEnabled) {
      setIsBlinkVisible(true);
      return;
    }
    const timer = setInterval(() => {
      setIsBlinkVisible((v) => !v);
    }, 500);
    return () => clearInterval(timer);
  }, [blinkEnabled]);

  // ─────────────────────────────────────────────────────────────────
  //  FULLSCREEN
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    function handleFSChange() {
      const banner = document.getElementById("banner");
      if (!banner) return;
      const isFS =
        document.fullscreenElement === banner ||
        (document as any).webkitFullscreenElement === banner;

      if (!isFS) {
        banner.classList.remove("fullscreen");
      } else {
        banner.classList.add("fullscreen");
      }
    }

    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFSChange as any
    );
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFSChange as any
      );
    };
  }, []);

  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
  }

  const toggleFullScreen = () => {
    const banner = document.getElementById("banner");
    if (!banner) return;

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const bannerEl = banner as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };

    const isAlreadyFull =
      doc.fullscreenElement !== null || doc.webkitFullscreenElement !== null;

    if (!isAlreadyFull) {
      if (banner.requestFullscreen) {
        banner.requestFullscreen();
      } else if (bannerEl.webkitRequestFullscreen) {
        bannerEl.webkitRequestFullscreen();
      } else if (isIOS()) {
        alert(t("fullscreenUnsupported"));
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  //  STOP / PLAY => center text on pause
  // ─────────────────────────────────────────────────────────────────
  const handleStopPlay = () => {
    if (!isStopped) {
      // about to pause => measure + center
      oldOffsetRef.current = offsetX;
      oldScaleRef.current = textScale;

      requestAnimationFrame(() => {
        const cw = containerRef.current?.offsetWidth ?? 1100;
        const tw = textRef.current?.offsetWidth ?? 0;

        // center => offset so left + tw/2 = cw/2
        const newOffset = cw / 2 - tw / 2;
        setOffsetX(newOffset);

        if (tw > cw) setTextScale(cw / tw);
        else setTextScale(1);

        setIsStopped(true);
      });
    } else {
      // unpause => revert
      setOffsetX(oldOffsetRef.current);
      setTextScale(oldScaleRef.current);
      setIsStopped(false);
    }
  };

  const handleDirection = (dir: "left" | "right") => {
    setDirection(dir);
    setIsStopped(false);
    setTextScale(1);
  };

  // ─────────────────────────────────────────────────────────────────
  //  METHODS FOR PNG / GIF
  // ─────────────────────────────────────────────────────────────────
  const pauseForPng = () => {
    previousStatesRef.current.wasStopped = isStopped;
    previousStatesRef.current.wasBlinking = blinkEnabled;

    setIsStopped(true);
    setBlinkEnabled(false);
    setIsBlinkVisible(true);
  };

  const revertPauseForPng = () => {
    setIsStopped(previousStatesRef.current.wasStopped);
    setBlinkEnabled(previousStatesRef.current.wasBlinking);
  };

  const unpauseForGif = () => {
    previousStatesRef.current.wasStopped = isStopped;
    setIsStopped(false);
  };

  const revertUnpauseForGif = () => {
    setIsStopped(previousStatesRef.current.wasStopped);
  };

  useImperativeHandle(ref, () => ({
    pauseForPng,
    revertPauseForPng,
    unpauseForGif,
    revertUnpauseForGif,
  }));

  // ─────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────
  // Banner style: locked ratio so there's never distortion
  const bannerStyle: React.CSSProperties = {
    aspectRatio: `${imageRatio}`, // ensures container matches real image ratio
    maxWidth: "800px",
    width: "100%",
    backgroundColor: bgColor,
    position: "relative",
    overflow: "hidden",
    ...(isBorderModeEnabled && {
      ["--color1" as any]: dynamicColor1,
      ["--color2" as any]: dynamicColor2,
      ["--color3" as any]: dynamicColor3,
    }),
  };

  const textStyle: React.CSSProperties = {
    position: "absolute" as const,
    top: "50%",
    left: offsetX,
    transform: `translateY(-50%) scale(${textScale})`,
    transformOrigin: "center center",
    whiteSpace: "nowrap",
    fontSize: `${fontSize}px`,
    color: textColor,
    fontWeight: isBold ? "bold" : "normal",
    visibility: isBlinkVisible ? "visible" : "hidden",
  };

  return (
    <div className="bg-pageBg mx-auto p-4 max-w-[1200px] shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t("ledScrollerTitle")}
      </h1>

      <section id="banner-background">
        {/* BANNER (with locked ratio) */}
        <div
          id="banner"
          className={`
            border-[5px] border-black my-5 mx-auto rounded-[10px]
            ${isBorderModeEnabled ? "animate-borderColorChange" : ""}
          `}
          style={bannerStyle}
        >
          {/* The transparent "LED holes" image, never distorted => object-contain */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <img
              src="/background_led.webp"
              alt="LED Wallpaper"
              className="w-full h-full object-contain"
            />
          </div>

          {/* The text behind the wallpaper */}
          <div ref={containerRef} className="absolute inset-0 z-0">
            <div ref={textRef} style={textStyle}>
              {bannerText}
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="input-container flex flex-col md:flex-row items-center gap-2 mb-4">
          <label htmlFor="text-input" className="sr-only">
            {t("enterYourTextLabel")}
          </label>
          <input
            type="text"
            id="text-input"
            placeholder={t("enterYourTextLabel")}
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="flex-1 p-2 rounded-full border-2 border-gray-300 text-black focus:outline-none w-full md:w-2/5"
          />

          {/* Fullscreen Button */}
          <div className="buttons-container flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <button
              id="fullscreen-button"
              onClick={toggleFullScreen}
              className="flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-3/10"
            >
              <img
                src={ICON_PATHS.fullscreen}
                alt={t("Click to set fullscreen")}
                width={18}
                height={18}
              />
              {t("fullScreenButton")}
            </button>
          </div>

          {/* Download Button (PNG/GIF) */}
          <div className="flex-none w-full md:w-auto">
            <LazyImageDownloader
              targetElementId="banner"
              iconPath={ICON_PATHS.download}
              t={t}
              bannerRef={ref as React.RefObject<BannerRef>}
              buttonClassName="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-3/10"
            />
          </div>
        </div>

        {/* TEXT SETTINGS */}
        <h2 className="text-2xl font-semibold mb-4">{t("bannerText")}</h2>
        <div className="bg-neutral-700 text-white p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Color */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.fontColor} alt="Font Color Icon" width={24} height={24} />
            <label htmlFor="text-color" className="whitespace-nowrap font-bold">
              {t("textColorLabel")}
            </label>
            <input
              type="color"
              id="text-color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 cursor-pointer appearance-none bg-transparent border-none rounded-[4px]"
            />
          </div>

          {/* Font Size */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.fontSize} alt="Font Size Icon" width={24} height={24} />
            <label htmlFor="font-size-slider" className="whitespace-nowrap font-bold">
              {t("fontSizeLabel")}
            </label>
            <input
              type="range"
              id="font-size-slider"
              min="10"
              max="350"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-48"
            />
          </div>

          {/* Blink Toggle */}
          <div className="setting-item flex items-center gap-2 flex-wrap">
            <img src={ICON_PATHS.blink} alt="Blink Icon" width={24} height={24} />
            <label htmlFor="blink-toggle" className="whitespace-nowrap font-bold">
              {t("blinkLabel")}
            </label>
            <div className="relative inline-block w-11 h-5">
              <input
                id="blink-toggle"
                type="checkbox"
                checked={blinkEnabled}
                onChange={(e) => setBlinkEnabled(e.target.checked)}
                className="peer appearance-none w-11 h-5 bg-gray-300 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="blink-toggle"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Marquee Speed */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.direction} alt="Direction Icon" width={24} height={24} />
            <label htmlFor="speed-slider" className="whitespace-nowrap font-bold">
              {t("speedLabel")}
            </label>
            <input
              type="range"
              id="speed-slider"
              min="1"
              max="20"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-48"
            />
          </div>

          {/* Direction & Stop/Play */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.direction} alt="Direction Icon" width={24} height={24} />
            <span className="font-bold">{t("directionLabel")}</span>
            <div id="direction-buttons" className="flex items-center gap-3">
              <img
                src={ICON_PATHS.leftArrow}
                alt="Left Arrow Icon"
                width={24}
                height={24}
                onClick={() => handleDirection("left")}
                className="cursor-pointer filter brightness-0 invert"
              />
              <img
                src={isStopped ? ICON_PATHS.play : ICON_PATHS.stop}
                alt="Stop/Play Icon"
                width={24}
                height={24}
                onClick={handleStopPlay}
                className="cursor-pointer filter brightness-0 invert"
              />
              <img
                src={ICON_PATHS.rightArrow}
                alt="Right Arrow Icon"
                width={24}
                height={24}
                onClick={() => handleDirection("right")}
                className="cursor-pointer filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Bold Toggle */}
          <div className="flex items-center gap-2">
            <label htmlFor="bold-toggle" className="font-bold">
              {t("bold")}
            </label>
            <div className="relative inline-block w-11 h-5">
              <input
                id="bold-toggle"
                type="checkbox"
                checked={isBold}
                onChange={(e) => setIsBold(e.target.checked)}
                className="peer appearance-none w-11 h-5 bg-gray-300 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="bold-toggle"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-gray-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* BANNER BACKGROUND SETTINGS */}
        <h2 className="text-2xl font-semibold mb-4">{t("bannerBackground")}</h2>
        <div className="bg-neutral-700 text-white p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Background Color */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.bgColor} alt="Background Color Icon" width={24} height={24} />
            <label htmlFor="bg-color" className="font-bold">
              {t("backgroundColorLabel")}
            </label>
            <input
              type="color"
              id="bg-color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 cursor-pointer appearance-none bg-transparent border-none rounded-[4px]"
            />
          </div>

          {/* Border Mode */}
          <div className="setting-item flex items-center gap-2">
            <img src={ICON_PATHS.borderMode} alt="Border Mode Icon" width={24} height={24} />
            <label htmlFor="border-mode" className="font-bold">
              {t("borderModeLabel")}
            </label>
            <div className="relative inline-block w-11 h-5">
              <input
                type="checkbox"
                id="border-mode"
                checked={isBorderModeEnabled}
                onChange={(e) => setIsBorderModeEnabled(e.target.checked)}
                className="peer appearance-none w-11 h-5 bg-gray-300 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="border-mode"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-gray-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
              />
            </div>
          </div>

          {/* Animated Border Colors */}
          <div className="setting-item flex flex-wrap items-center gap-2">
            <img src={ICON_PATHS.borderColor} alt="Border Color Icon" width={24} height={24} />
            <label htmlFor="dynamic-color1" className="whitespace-nowrap font-bold">
              {t("primaryBorderColorLabel")}
            </label>
            <input
              type="color"
              id="dynamic-color1"
              value={dynamicColor1}
              onChange={(e) => setDynamicColor1(e.target.value)}
              className="w-8 h-8 cursor-pointer appearance-none bg-transparent border-none rounded-[4px]"
              disabled={!isBorderModeEnabled}
            />
            <label htmlFor="dynamic-color2" className="sr-only">
              {t("secondaryBorderColorLabel")}
            </label>
            <input
              type="color"
              id="dynamic-color2"
              value={dynamicColor2}
              onChange={(e) => setDynamicColor2(e.target.value)}
              className="w-8 h-8 cursor-pointer appearance-none bg-transparent border-none rounded-[4px]"
              disabled={!isBorderModeEnabled}
            />
            <label htmlFor="dynamic-color3" className="sr-only">
              {t("tertiaryBorderColorLabel")}
            </label>
            <input
              type="color"
              id="dynamic-color3"
              value={dynamicColor3}
              onChange={(e) => setDynamicColor3(e.target.value)}
              className="w-8 h-8 cursor-pointer appearance-none bg-transparent border-none rounded-[4px]"
              disabled={!isBorderModeEnabled}
            />
          </div>
        </div>
      </section>


      {/* Additional Content Sections */}
      <h2 className="mt-6 text-lg font-semibold">{t("whyYouNeedTitle")}</h2>
      <p className="mb-4">{t("whyYouNeedDescription")}</p>
      <h2 className="text-lg font-semibold">{t("howDoesItWorkTitle")}</h2>
      <p className="mb-4">{t("howDoesItWorkDescription1")}</p>
      <h2 className="text-lg font-semibold">{t("moreAboutAppTitle")}</h2>
      <p className="mb-4">{t("moreAboutAppDescription1")}</p>
      <h2 className="text-lg font-semibold">{t("downloadForAndroidTitle")}</h2>
      <p className="mb-2">{t("exclusiveBenefitsListTitle")}</p>
      <ul className="list-disc list-inside mb-4">
        <li>{t("exclusiveBenefitsListItem1")}</li>
        <li>{t("exclusiveBenefitsListItem2")}</li>
        <li>{t("exclusiveBenefitsListItem3")}</li>
        <li>{t("exclusiveBenefitsListItem4")}</li>
      </ul>
      <div className="play-store-badge">
        <a
          href="https://play.google.com/store/apps/details?id=ledscroller.ledbanner.signboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/Google_Play_Store_badge_EN.svg"
            alt={t("downloadOnPlayStoreAlt")}
            width={144}
            height={43}
          />
        </a>
      </div>
    </div>
  );
});

export default LedBanner;
