import React, { memo, ChangeEvent, ComponentType } from 'react';

interface SettingsPanelProps {
  bannerText: string;
  setBannerText: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  textColor: string;
  setTextColor: (value: string) => void;
  bgColor: string;
  setBgColor: (value: string) => void;
  isBold: boolean;
  setIsBold: (value: boolean) => void;
  blink: boolean;
  setBlink: (value: boolean) => void;
  marqueeSpeed: number;
  setMarqueeSpeed: (value: number) => void;
  isStopped: boolean;
  setIsStopped: (value: boolean) => void;
  direction: 'left' | 'right';
  setDirection: (dir: 'left' | 'right') => void;
  handleStopPlay: () => void;
  isBorderModeEnabled: boolean;
  setIsBorderModeEnabled: (value: boolean) => void;
  dynamicColor1: string;
  setDynamicColor1: (value: string) => void;
  dynamicColor2: string;
  setDynamicColor2: (value: string) => void;
  dynamicColor3: string;
  setDynamicColor3: (value: string) => void;
  toggleFullScreen: () => void;
  ICON_PATHS: Record<string, string>;
  t: (key: string) => string;

  // Pass in your lazy-loaded component
  LazyImageDownloader: ComponentType<{
    targetElementId: string;
    iconPath: string;
    t: (key: string) => string;
    buttonClassName?: string; // optional
  }>;
}

function SettingsPanel({
                         bannerText,
                         setBannerText,
                         fontSize,
                         setFontSize,
                         textColor,
                         setTextColor,
                         bgColor,
                         setBgColor,
                         isBold,
                         setIsBold,
                         blink,
                         setBlink,
                         marqueeSpeed,
                         setMarqueeSpeed,
                         isStopped,
                         setIsStopped,
                         direction,
                         setDirection,
                         handleStopPlay,
                         isBorderModeEnabled,
                         setIsBorderModeEnabled,
                         dynamicColor1,
                         setDynamicColor1,
                         dynamicColor2,
                         setDynamicColor2,
                         dynamicColor3,
                         setDynamicColor3,
                         toggleFullScreen,
                         ICON_PATHS,
                         t,
                         LazyImageDownloader,
                       }: SettingsPanelProps) {
  return (
    <>
      {/* INPUTS / CONTROLS */}
      <div className="input-container flex flex-col md:flex-row items-center gap-2 mb-4">
        <label htmlFor="text-input" className="sr-only">
          {t('enterYourTextLabel')}
        </label>
        <input
          type="text"
          id="text-input"
          placeholder={t('enterYourTextLabel')}
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          className="flex-1 p-2 rounded-full border-2 border-gray-300 text-black focus:outline-none w-full md:w-2/5"
        />

        {/* Buttons Container */}
        <div className="buttons-container flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <button
            id="fullscreen-button"
            onClick={toggleFullScreen}
            className="flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-3/10"
          >
            <img
              src={ICON_PATHS.fullscreen}
              alt={t('Click to set fullscreen')}
              width={18}
              height={18}
              className="fill-white"
            />
            {t('fullScreenButton')}
          </button>
        </div>
      </div>

      {/* Banner Text Settings */}
      <h2 className="text-2xl font-semibold mb-4">{t('bannerText')}</h2>
      <div className="bg-neutral-700 text-white p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Color */}
        <div className="setting-item flex items-center gap-2">
          <img src={ICON_PATHS.fontColor} alt="Font Color Icon" width={24} height={24} />
          <label htmlFor="text-color" className="whitespace-nowrap font-bold">
            {t('textColorLabel')}
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
            {t('fontSizeLabel')}
          </label>
          <input
            type="range"
            id="font-size-slider"
            min="10"
            max="350"
            value={fontSize}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFontSize(Number(e.target.value))}
            className="w-48"
          />
        </div>

        {/* Blink Toggle */}
        <div className="setting-item flex items-center gap-2 flex-wrap">
          <img src={ICON_PATHS.blink} alt="Blink Icon" width={24} height={24} />
          <label htmlFor="blink-toggle" className="whitespace-nowrap font-bold">
            {t('blinkLabel')}
          </label>
          <div className="relative inline-block w-11 h-5">
            <input
              id="blink-toggle"
              type="checkbox"
              checked={blink}
              onChange={(e) => setBlink(e.target.checked)}
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
            {t('speedLabel')}
          </label>
          <input
            type="range"
            id="speed-slider"
            min="1"
            max="20"
            value={marqueeSpeed}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMarqueeSpeed(Number(e.target.value))}
            className="w-48"
          />
        </div>

        {/* Direction and Stop/Play */}
        <div className="setting-item flex items-center gap-2">
          <img src={ICON_PATHS.direction} alt="Direction Icon" width={24} height={24} />
          <span className="font-bold">{t('directionLabel')}</span>
          <div id="direction-buttons" className="flex items-center gap-3">
            <img
              src={ICON_PATHS.leftArrow}
              alt="Left Arrow Icon"
              width={24}
              height={24}
              onClick={() => setDirection('left')}
              className="cursor-pointer filter brightness-0 invert"
            />
            <img
              src={isStopped ? ICON_PATHS.play : ICON_PATHS.stop}
              alt="Stop or Play Icon"
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
              onClick={() => setDirection('right')}
              className="cursor-pointer filter brightness-0 invert"
            />
          </div>
        </div>

        {/* Bold Toggle */}
        <div className="flex items-center gap-2">
          <label htmlFor="bold-toggle" className="font-bold">
            {t('bold')}
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

      {/* Banner Background Settings */}
      <h2 className="text-2xl font-semibold mb-4">{t('bannerBackground')}</h2>
      <div className="bg-neutral-700 text-white p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Background Color */}
        <div className="setting-item flex items-center gap-2">
          <img src={ICON_PATHS.bgColor} alt="Background Color Icon" width={24} height={24} />
          <label htmlFor="bg-color" className="font-bold">
            {t('backgroundColorLabel')}
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
            {t('borderModeLabel')}
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

        {/* Animated/Static Border Colors */}
        <div className="setting-item flex flex-wrap items-center gap-2">
          <img src={ICON_PATHS.borderColor} alt="Border Color Icon" width={24} height={24} />
          <label htmlFor="dynamic-color1" className="whitespace-nowrap font-bold">
            {t('primaryBorderColorLabel')}
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
            {t('secondaryBorderColorLabel')}
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
            {t('tertiaryBorderColorLabel')}
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

      {/* Download Button (LazyImageDownloader) */}
      <div className="mt-4">
        <LazyImageDownloader
          targetElementId="banner"
          iconPath={ICON_PATHS.download} // or '/assets/download.svg'
          t={t}
        />
      </div>
    </>
  );
}

export default memo(SettingsPanel);
