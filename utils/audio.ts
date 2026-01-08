
let audioCtx: AudioContext | null = null;

const getCtx = async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive'
    });
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  return audioCtx;
};

export const playBootSound = async () => {
  const ctx = await getCtx();
  const now = ctx.currentTime;

  // Layer 1: Ascending Harmonic (Industrial Power Up)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(40, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);
  
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

  // Layer 2: Mechanical Resonance
  const pulse = ctx.createOscillator();
  const pulseGain = ctx.createGain();
  pulse.type = 'square';
  pulse.frequency.setValueAtTime(20, now);
  pulse.frequency.linearRampToValueAtTime(60, now + 0.5);
  
  pulseGain.gain.setValueAtTime(0, now);
  pulseGain.gain.linearRampToValueAtTime(0.02, now + 0.05);
  pulseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(oscGain).connect(ctx.destination);
  pulse.connect(pulseGain).connect(ctx.destination);

  osc.start(now);
  pulse.start(now);
  osc.stop(now + 2);
  pulse.stop(now + 0.7);
};

export const playExecuteSound = async () => {
  const ctx = await getCtx();
  const now = ctx.currentTime;

  // Heavy Industrial Stamp Sound
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'triangle';
  click.frequency.setValueAtTime(3500, now);
  click.frequency.exponentialRampToValueAtTime(800, now + 0.03);
  clickGain.gain.setValueAtTime(0.3, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = 'square';
  thud.frequency.setValueAtTime(140, now);
  thud.frequency.exponentialRampToValueAtTime(50, now + 0.12);
  thudGain.gain.setValueAtTime(0.12, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(60, now + 0.01);
  subGain.gain.setValueAtTime(0, now + 0.01);
  subGain.gain.linearRampToValueAtTime(1, now + 0.02);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  click.connect(clickGain).connect(ctx.destination);
  thud.connect(thudGain).connect(ctx.destination);
  sub.connect(subGain).connect(ctx.destination);

  click.start(now);
  thud.start(now);
  sub.start(now + 0.01);
  
  click.stop(now + 0.1);
  thud.stop(now + 0.3);
  sub.stop(now + 2);
};

export const playInterfaceSound = async () => {
  const ctx = await getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.02);
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
};

export const resumeAudioContext = async () => {
  await getCtx();
};
