import React, { memo } from 'react';

interface MarqueeProps {
  bannerText: string;
  fontSize: number;
  textColor: string;
  isBold: boolean;
  blink: boolean;
  isStopped: boolean;
  direction: 'left' | 'right';
  marqueeDuration: number;
}

function Marquee({
                   bannerText,
                   fontSize,
                   textColor,
                   isBold,
                   blink,
                   isStopped,
                   direction,
                   marqueeDuration,
                 }: MarqueeProps) {
  // Compute styles for the marquee
  const marqueeStyle: React.CSSProperties = {
    animationPlayState: isStopped ? 'paused' : 'running',
    animationDirection: direction === 'right' ? 'reverse' : 'normal',
    animationDuration: `${marqueeDuration}s`,
  };

  const blinkClass = blink ? 'animate-blink' : '';

  return (
    <div
      className="
        marquee absolute inset-0 z-0
        flex items-center justify-center
        whitespace-nowrap animate-marquee
      "
      style={marqueeStyle}
    >
      <span
        className={`
          inline-block select-none
          text-yellow-500
          ${isBold ? 'font-bold' : 'font-normal'}
          ${blinkClass}
        `}
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      >
        {bannerText}
      </span>
    </div>
  );
}

// `memo` ensures this component only re-renders if its props change
export default memo(Marquee);
