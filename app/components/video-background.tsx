import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface VideoBackgroundProps {
  /** Path to the video file (served from /public). */
  src?: string;
  /** Optional poster image shown while the video loads. */
  poster?: string;
  /**
   * Playback speed (1 = normal). The source clip is already slowed/smoothed at
   * encode time, so this stays at 1; lower it only for an extra slow-down.
   */
  playbackRate?: number;
  /** Tailwind classes for the dark readability overlay. */
  overlayClassName?: string;
  className?: string;
}

/**
 * Fixed, full-screen looping video background that sits behind all page
 * content. Muted + playsInline so it autoplays on every browser, with a dark
 * overlay for text contrast. The MP4 loads at the browser's default (low)
 * priority, so it does not compete with the critical render path — the LCP
 * element is the hero text, which paints before the video matters. Respects
 * `prefers-reduced-motion`: hidden via `motion-reduce:hidden` (CSS, works
 * without JS) and paused via a `matchMedia` effect.
 */
export function VideoBackground({
  src = "/videos/background.mp4",
  poster,
  playbackRate = 1,
  overlayClassName,
  className,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyRate = () => {
      video.playbackRate = playbackRate;
    };
    applyRate();
    video.addEventListener("loadeddata", applyRate);

    const apply = () => {
      if (media.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      video.removeEventListener("loadeddata", applyRate);
    };
  }, [playbackRate]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className={cn("absolute inset-0 bg-background/70", overlayClassName)}
      />
    </div>
  );
}
