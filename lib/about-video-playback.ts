/** Playback policy kept separate from the UI so races and user intent can be tested. */
export type PlaybackState = {
  near: boolean;
  inView: boolean;
  tabVisible: boolean;
  reduced: boolean;
  intent: "auto" | "play" | "pause";
  loaded: boolean;
  playing: boolean;
  pending: boolean;
  completed: boolean;
  blocked: boolean;
  error: boolean;
};
export const initialPlaybackState: PlaybackState = {
  near: false,
  inView: false,
  tabVisible: true,
  reduced: true,
  intent: "auto",
  loaded: false,
  playing: false,
  pending: false,
  completed: false,
  blocked: false,
  error: false,
};
export function shouldPlay(s: PlaybackState) {
  return (
    s.inView &&
    s.tabVisible &&
    !s.completed &&
    !s.blocked &&
    !s.error &&
    s.intent !== "pause" &&
    (!s.reduced || s.intent === "play")
  );
}
type VideoPort = Pick<
  HTMLVideoElement,
  | "src"
  | "preload"
  | "muted"
  | "currentTime"
  | "paused"
  | "play"
  | "pause"
  | "load"
>;
export class AboutVideoPlayback {
  state = { ...initialPlaybackState };
  private attempt = 0;
  private disposed = false;
  constructor(
    private video: VideoPort,
    private source: string,
    private changed: (state: PlaybackState) => void,
  ) {}
  private emit() {
    if (!this.disposed) this.changed({ ...this.state });
  }
  environment(
    next: Partial<
      Pick<PlaybackState, "near" | "inView" | "tabVisible" | "reduced">
    >,
  ) {
    if (
      next.reduced === true &&
      !this.state.reduced &&
      this.state.intent !== "pause"
    )
      this.state.intent = "auto";
    Object.assign(this.state, next);
    this.reconcile();
  }
  private load() {
    if (this.state.loaded) return;
    this.state.loaded = true;
    this.video.muted = true;
    this.video.preload = "metadata";
    this.video.src = this.source;
    this.video.load();
  }
  private reconcile() {
    if (this.disposed) return;
    if (
      this.state.tabVisible &&
      ((this.state.near && !this.state.reduced) || this.state.intent === "play")
    )
      this.load();
    if (!shouldPlay(this.state)) {
      this.attempt++;
      this.state.pending = false;
      this.video.pause();
      this.state.playing = false;
      this.emit();
      return;
    }
    if (this.state.playing || this.state.pending) {
      this.emit();
      return;
    }
    this.load();
    const token = ++this.attempt;
    this.state.pending = true;
    this.emit();
    try {
      Promise.resolve(this.video.play())
        .then(() => {
          if (this.disposed || token !== this.attempt) {
            if (this.disposed || !shouldPlay(this.state)) this.video.pause();
            return;
          }
          this.state.pending = false;
          this.state.playing = true;
          this.emit();
        })
        .catch(() => {
          if (this.disposed || token !== this.attempt) return;
          this.state.pending = false;
          this.state.playing = false;
          this.state.blocked = true;
          this.emit();
        });
    } catch {
      this.state.pending = false;
      this.state.blocked = true;
      this.emit();
    }
  }
  pause() {
    this.state.intent = "pause";
    this.reconcile();
  }
  play() {
    this.state.intent = "play";
    this.state.blocked = false;
    if (this.state.error) {
      this.state.error = false;
      this.state.loaded = false;
    }
    if (this.state.completed) {
      this.state.completed = false;
      this.video.currentTime = 0;
    }
    this.reconcile();
  }
  mediaPlaying() {
    if (!shouldPlay(this.state)) {
      this.video.pause();
      return;
    }
    this.state.playing = true;
    this.state.pending = false;
    this.emit();
  }
  mediaPaused() {
    this.state.playing = false;
    this.emit();
  }
  ended() {
    this.attempt++;
    // Native loop normally prevents ended; retain a guarded restart fallback.
    if (shouldPlay(this.state)) {
      this.video.currentTime = 0;
      this.state.pending = false;
      this.state.playing = false;
      this.reconcile();
      return;
    }
    this.state.completed = true;
    this.state.pending = false;
    this.state.playing = false;
    this.emit();
  }
  failed() {
    this.attempt++;
    this.state.error = true;
    this.state.pending = false;
    this.state.playing = false;
    this.video.pause();
    this.emit();
  }
  dispose() {
    this.disposed = true;
    this.attempt++;
    this.video.pause();
  }
}
