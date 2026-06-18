import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface VideoBackgroundProps {
  /** Path to the video file (served from /public). */
  src?: string;
  /** Lightweight poster image — the only background asset loaded on mobile. */
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
 * content. For performance the heavy MP4 (~5.7MB) is only loaded on wider
 * screens with motion enabled; phones and `prefers-reduced-motion` users get
 * the lightweight static poster image (~40KB) instead, which looks the same
 * under the dark overlay. The poster also serves as the instant placeholder on
 * desktop while the video buffers. Page content scrolls normally over it.
 */
export function VideoBackground({
  src = "/videos/background.mp4",
  poster = "/videos/background-poster.webp",
  playbackRate = 1,
  overlayClassName,
  className,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Default false so prerendered HTML ships no <video> (no eager download).
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setShowVideo(wide.matches && !reduce.matches);
    decide();
    wide.addEventListener("change", decide);
    reduce.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      reduce.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    const applyRate = () => {
      video.playbackRate = playbackRate;
    };
    applyRate();
    video.addEventListener("loadeddata", applyRate);
    video.play().catch(() => {});
    return () => video.removeEventListener("loadeddata", applyRate);
  }, [showVideo, playbackRate]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background",
        className,
      )}
    >
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for readability */}
      <div
        className={cn("absolute inset-0 bg-background/70", overlayClassName)}
      />
    </div>
  );
}
