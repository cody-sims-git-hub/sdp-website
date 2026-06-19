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
 * Fixed, full-screen looping video background behind all page content.
 *
 * The video is deferred: the prerendered HTML ships no source and the element
 * uses `preload="none"`, so nothing downloads during page load. Once the page
 * is idle (after the hero/LCP has rendered) the source is attached and playback
 * starts — so the ~6MB clip never competes with the critical render path. Until
 * then the fixed `bg-background` shows, which is visually the same as the
 * already-dark overlaid video. Muted + playsInline so it autoplays everywhere;
 * `prefers-reduced-motion` skips loading entirely (CSS hides it too).
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return; // no motion -> never load the video

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      video.src = src; // attach source now (deferred) -> begins loading
      video.playbackRate = playbackRate;
      video.play().catch(() => {});
    };

    const applyRate = () => {
      video.playbackRate = playbackRate;
    };
    video.addEventListener("loadeddata", applyRate);

    // Defer until the browser is idle (post-LCP) so the video stays off the
    // critical path. Fallback timer for browsers without requestIdleCallback.
    let idleId: number | undefined;
    let timerId: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 3000 });
    } else {
      timerId = window.setTimeout(start, 1500);
    }

    const onReduceChange = () => {
      if (reduce.matches) video.pause();
      else if (started) video.play().catch(() => {});
    };
    reduce.addEventListener("change", onReduceChange);

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) window.clearTimeout(timerId);
      video.removeEventListener("loadeddata", applyRate);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, [src, playbackRate]);

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
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
      />

      <div
        className={cn("absolute inset-0 bg-background/70", overlayClassName)}
      />
    </div>
  );
}
