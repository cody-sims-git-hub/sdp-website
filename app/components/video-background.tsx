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
 * overlay for text contrast. Respects `prefers-reduced-motion`: the video is
 * hidden via CSS (`motion-reduce:hidden`) and paused via JS, leaving a clean
 * dark background. Page content scrolls normally over it.
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

    // Slow the motion. Re-applied on load since some browsers reset the rate.
    const applyRate = () => {
      video.playbackRate = playbackRate;
    };
    applyRate();
    video.addEventListener("loadeddata", applyRate);

    const apply = () => {
      if (media.matches) {
        video.pause();
      } else {
        // Muted autoplay is permitted; ignore rejection if it's blocked.
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

      {/* Dark overlay for readability */}
      <div
        className={cn(
          "absolute inset-0 bg-background/70",
          overlayClassName,
        )}
      />
    </div>
  );
}
