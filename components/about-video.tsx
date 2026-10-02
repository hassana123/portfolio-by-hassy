"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  AboutVideoPlayback,
  initialPlaybackState,
} from "@/lib/about-video-playback";

export default function AboutVideo({
  video,
  poster,
  image,
  description,
}: {
  video: string;
  poster: string;
  image: string;
  description: string;
}) {
  const frame = useRef<HTMLDivElement>(null),
    element = useRef<HTMLVideoElement>(null),
    controller = useRef<AboutVideoPlayback | null>(null);
  const [state, setState] = useState({ ...initialPlaybackState }),
    [posterFailed, setPosterFailed] = useState(false),
    [imageFailed, setImageFailed] = useState(false);
  const id = useId();
  const still = !posterFailed && poster ? poster : !imageFailed ? image : "";
  useEffect(() => {
    if (!video || !element.current || !frame.current) return;
    const node = element.current;
    const playback = new AboutVideoPlayback(node, video, setState);
    controller.current = playback;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const preferences = () =>
      playback.environment({
        reduced: reduced.matches,
        tabVisible: !document.hidden,
      });
    const playing = () => playback.mediaPlaying(),
      pause = () => playback.mediaPaused(),
      ended = () => playback.ended(),
      error = () => playback.failed();
    node.addEventListener("playing", playing);
    node.addEventListener("pause", pause);
    node.addEventListener("ended", ended);
    node.addEventListener("error", error);
    reduced.addEventListener("change", preferences);
    document.addEventListener("visibilitychange", preferences);
    preferences();
    let near: IntersectionObserver | undefined,
      visible: IntersectionObserver | undefined;
    const measure = () => {
      const r = frame.current!.getBoundingClientRect();
      const width = Math.max(
        0,
        Math.min(r.right, innerWidth) - Math.max(0, r.left),
      );
      const height = Math.max(
        0,
        Math.min(r.bottom, innerHeight) - Math.max(0, r.top),
      );
      playback.environment({
        near: r.bottom > -300 && r.top < innerHeight + 300,
        inView: (width * height) / Math.max(1, r.width * r.height) >= 0.5,
      });
    };
    if (typeof IntersectionObserver !== "undefined") {
      near = new IntersectionObserver(
        (entries) => playback.environment({ near: entries[0].isIntersecting }),
        { rootMargin: "300px 0px" },
      );
      visible = new IntersectionObserver(
        (entries) =>
          playback.environment({
            inView:
              entries[0].isIntersecting && entries[0].intersectionRatio >= 0.5,
          }),
        { threshold: [0, 0.5, 1] },
      );
      near.observe(frame.current);
      visible.observe(frame.current);
    } else {
      measure();
      window.addEventListener("scroll", measure, { passive: true });
      window.addEventListener("resize", measure);
    }
    return () => {
      near?.disconnect();
      visible?.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", preferences);
      document.removeEventListener("visibilitychange", preferences);
      node.removeEventListener("playing", playing);
      node.removeEventListener("pause", pause);
      node.removeEventListener("ended", ended);
      node.removeEventListener("error", error);
      playback.dispose();
      controller.current = null;
    };
  }, [video]);
  const showStill = !video || !state.loaded || state.error || state.blocked;
  const label = state.completed
    ? "Replay"
    : state.playing || state.pending
      ? "Pause"
      : "Play";
  return (
    <div className="about-video-card">
      <div className="about-video-frame" ref={frame}>
        {video && (
          <video
            ref={element}
            id={id}
            className={showStill ? "about-video-concealed" : ""}
            width={1280}
            height={720}
            muted
            playsInline
            loop
            preload="none"
            poster={still || undefined}
            aria-label={description}
            aria-describedby={`${id}-description`}
            disablePictureInPicture
          />
        )}
        {showStill &&
          (still ? (
            <img
              className="about-video-still"
              src={still}
              alt={description}
              width={1280}
              height={720}
              loading="lazy"
              onError={() => {
                if (still === poster) setPosterFailed(true);
                else setImageFailed(true);
              }}
            />
          ) : (
            <div className="about-video-empty">
              {description || "A little introduction"}
            </div>
          ))}
      </div>
      <div className="about-video-toolbar">
        <span id={`${id}-description`} className="sr-only">
          {description}. Silent video; repeats until paused. Playback pauses
          outside the viewport.
        </span>
        <span className="about-video-status" role="status">
          {state.error
            ? "Video unavailable. You can retry playback."
            : state.blocked
              ? "Press Play to start."
              : state.completed
                ? "A little hello, just for you."
                : state.reduced && state.intent === "auto"
                  ? "Play when you’re ready."
                  : ""}
        </span>
        {video && (
          <button
            type="button"
            className="about-video-control"
            aria-controls={id}
            aria-label={`${label} introduction video`}
            onClick={() =>
              state.playing || state.pending
                ? controller.current?.pause()
                : controller.current?.play()
            }
          >
            {state.completed ? (
              <RotateCcw size={14} />
            ) : state.playing || state.pending ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
            <span>{label}</span>
          </button>
        )}
      </div>
    </div>
  );
}
