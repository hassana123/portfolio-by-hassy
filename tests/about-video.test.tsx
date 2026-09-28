import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import AboutVideo from "../components/about-video";
import { AboutVideoPlayback } from "../lib/about-video-playback";
import { demoSettings } from "../lib/demo";
import { settingsSchema } from "../lib/model";

function fixture() {
  let starts = 0,
    loads = 0;
  const video = {
    src: "",
    preload: "none" as HTMLVideoElement["preload"],
    muted: false,
    currentTime: 0,
    paused: true,
    play: () => {
      starts++;
      video.paused = false;
      return Promise.resolve();
    },
    pause: () => {
      video.paused = true;
    },
    load: () => {
      loads++;
    },
  };
  const playback = new AboutVideoPlayback(
    video,
    "/demo/about-hello.mp4",
    () => {},
  );
  return { video, playback, starts: () => starts, loads: () => loads };
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};
test("About video is absent from initial network sources; poster and native keyboard button render", () => {
  const html = renderToStaticMarkup(
    <AboutVideo
      video="/demo/about-hello.mp4"
      poster="/demo/about-hello-poster.jpg"
      image="/demo/about.jpg"
      description="Typing, then waving hello"
    />,
  );
  const video = html.match(/<video[^>]*>/)![0];
  assert.ok(!video.includes("src="));
  assert.ok(video.includes('preload="none"'));
  assert.ok(video.includes("muted"));
  assert.ok(video.includes("playsInline"));
  assert.ok(video.includes("loop"));
  assert.match(html, /<button[^>]*type="button"/);
  assert.match(html, /Play introduction video/);
  assert.match(html, /about-hello-poster.jpg/);
});
test("Playback defers loading until near, starts at half visibility, and pauses outside", async () => {
  const f = fixture();
  f.playback.environment({ reduced: false });
  assert.equal(f.video.src, "");
  f.playback.environment({ near: true });
  assert.equal(f.loads(), 1);
  assert.equal(f.starts(), 0);
  f.playback.environment({ inView: true });
  await flush();
  assert.equal(f.starts(), 1);
  assert.ok(f.playback.state.playing);
  f.playback.environment({ inView: false });
  assert.ok(f.video.paused);
  assert.equal(f.playback.state.playing, false);
});
test("Manual pause survives viewport re-entry and visibility changes", async () => {
  const f = fixture();
  f.playback.environment({ near: true, inView: true, reduced: false });
  await flush();
  f.playback.pause();
  f.playback.environment({ reduced: true });
  f.playback.environment({ reduced: false });
  f.playback.environment({ inView: false, tabVisible: false });
  f.playback.environment({ inView: true, tabVisible: true });
  await flush();
  assert.equal(f.starts(), 1);
  assert.ok(f.video.paused);
  f.playback.play();
  await flush();
  assert.equal(f.starts(), 2);
});
test("Hidden tab pauses and resumes only eligible playback", async () => {
  const f = fixture();
  f.playback.environment({ inView: true, reduced: false });
  await flush();
  f.playback.environment({ tabVisible: false });
  assert.ok(f.video.paused);
  f.playback.environment({ tabVisible: true });
  await flush();
  assert.equal(f.starts(), 2);
});
test("Video repeats at the end until manually paused", async () => {
  const f = fixture();
  f.playback.environment({ inView: true, reduced: false });
  await flush();
  f.video.currentTime = 8;
  f.playback.ended();
  await flush();
  assert.equal(f.video.currentTime, 0);
  assert.equal(f.starts(), 2);
  assert.equal(f.playback.state.completed, false);
  f.playback.pause();
  f.playback.ended();
  f.playback.environment({ inView: false });
  f.playback.environment({ inView: true });
  await flush();
  assert.equal(f.starts(), 2);
  assert.ok(f.video.paused);
});
test("Reduced motion does not fetch video or autoplay, but permits explicit play", async () => {
  const f = fixture();
  f.playback.environment({ near: true, inView: true, reduced: true });
  assert.equal(f.loads(), 0);
  assert.equal(f.starts(), 0);
  f.playback.play();
  await flush();
  assert.equal(f.starts(), 1);
  f.playback.environment({ inView: false });
  assert.ok(f.video.paused);
});
test("Blocked autoplay shows a retry state and scrolling never retries it", async () => {
  const f = fixture();
  f.video.play = () => Promise.reject(new Error("NotAllowedError"));
  f.playback.environment({ inView: true, reduced: false });
  await flush();
  assert.ok(f.playback.state.blocked);
  f.playback.environment({ inView: false });
  f.playback.environment({ inView: true });
  assert.equal(f.playback.state.pending, false);
  f.video.play = () => Promise.resolve();
  f.playback.play();
  await flush();
  assert.ok(f.playback.state.playing);
  assert.equal(f.playback.state.blocked, false);
});
test("Loading failure pauses, preserves a poster state, and explicit retry reloads", async () => {
  const f = fixture();
  f.playback.environment({ near: true, inView: true, reduced: false });
  await flush();
  f.playback.failed();
  assert.ok(f.playback.state.error);
  assert.ok(f.video.paused);
  f.playback.environment({ inView: true });
  assert.equal(f.starts(), 1);
  f.playback.play();
  await flush();
  assert.equal(f.loads(), 2);
  assert.equal(f.playback.state.error, false);
});
test("Late play resolution cannot override manual pause or a hidden tab", async () => {
  const f = fixture();
  let resolve!: () => void;
  f.video.play = () =>
    new Promise<void>((r) => {
      resolve = r;
    });
  f.playback.environment({ inView: true, reduced: false });
  f.playback.pause();
  resolve();
  await flush();
  assert.ok(f.video.paused);
  assert.equal(f.playback.state.playing, false);
});
test("Legacy settings load safely without About video fields", () => {
  const { aboutVideo, aboutPoster, aboutVideoDescription, ...legacy } =
    demoSettings;
  const parsed = settingsSchema.parse(legacy);
  assert.equal(parsed.aboutVideo, "");
  assert.equal(parsed.aboutPoster, "");
  assert.equal(parsed.aboutImage, legacy.aboutImage);
  assert.equal(
    settingsSchema.safeParse({
      ...demoSettings,
      aboutVideo: "https://unmanaged.example/video.mp4",
    }).success,
    false,
  );
});
