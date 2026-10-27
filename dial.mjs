const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const wrapIndex = (value, count) => ((Math.round(value) % count) + count) % count;
export const wheelPixels = (event, height) => {
  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  return delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
};

// Positions are measured in cards, including fractions. No DOM or frame-rate assumptions.
export class ProjectDial {
  position = 0;
  target = 0;
  velocity = 0;
  mode = 'idle';
  lastInput = 0;
  lastFrame = null;

  scroll(cards, now) {
    if (!Number.isFinite(cards) || !cards) return;
    if (this.mode !== 'input') this.target = this.position;
    this.target += clamp(cards, -2, 2);
    this.mode = 'input';
    this.lastInput = now;
    this.lastFrame ??= now;
  }

  beginDrag(now) {
    this.mode = 'drag';
    this.target = this.position;
    this.velocity = 0;
    this.lastInput = now;
  }

  drag(cards, now) {
    const dt = Math.max((now - this.lastInput) / 1000, .008);
    const speed = clamp(cards / dt, -10, 10);
    this.velocity = this.velocity * .35 + speed * .65;
    this.position += cards;
    this.target = this.position;
    this.lastInput = now;
  }

  release(now, cancelled = false) {
    if (cancelled || now - this.lastInput > 90) this.velocity = 0;
    this.snap();
    this.lastFrame = now;
  }

  snap() {
    this.target = Math.round(this.target + clamp(this.velocity * .065, -.55, .55));
    this.velocity = clamp(this.velocity, -8, 8);
    this.mode = 'snap';
  }

  goTo(index, count, immediate = false) {
    const distance = ((index - this.position + count / 2) % count + count) % count - count / 2;
    this.target = Math.round(this.position + distance);
    this.velocity = 0;
    this.mode = 'snap';
    this.lastFrame = null;
    if (immediate) this.finish();
  }

  finish() {
    this.position = this.target = Math.round(this.target);
    this.velocity = 0;
    this.mode = 'idle';
    this.lastFrame = null;
  }

  step(now) {
    if (this.mode === 'idle' || this.mode === 'drag') return false;
    const dt = clamp(this.lastFrame === null ? 1 / 60 : (now - this.lastFrame) / 1000, 0, .05);
    this.lastFrame = now;
    if (this.mode === 'input' && now - this.lastInput >= 110) this.snap();
    if (this.mode === 'input') {
      // Follow every scroll delta, with a little damping to remove trackpad jitter.
      const before = this.position;
      this.position += (this.target - this.position) * (1 - Math.exp(-32 * dt));
      if (dt) this.velocity = this.velocity * .3 + ((this.position - before) / dt) * .7;
    } else {
      // Analytic critically damped spring: same feel at 60 Hz and 120 Hz.
      const omega = 15, offset = this.position - this.target;
      const decay = Math.exp(-omega * dt), change = (this.velocity + omega * offset) * dt;
      this.position = this.target + (offset + change) * decay;
      this.velocity = (this.velocity - omega * change) * decay;
      if (Math.abs(this.position - this.target) < .001 && Math.abs(this.velocity) < .015) this.finish();
    }
    return this.mode !== 'idle';
  }
}
