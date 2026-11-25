import { addToCart } from "@/lib/features/cart/cartSlice";

const CLASS_MATCHERS = {
  apple: /apple/i,
  banana: /banana/i,
  bottle: /bottle|beverage|drink|water/i,
  book: /book|notebook/i
};

const detectedItems = new Set();
const cooldownTimers = new Map();
const COOLDOWN_TIME = 3000;

function playBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
    oscillator.onended = () => audioContext.close().catch(() => {});
  } catch {
    // Audio feedback is optional; detection and cart updates must still work.
  }
}

export function renderPredictions(predictions, ctx, dispatch, products = []) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "top";

  const detectedProductIds = new Set();

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const className = prediction.class;
    const matcher = CLASS_MATCHERS[className];
    const product = matcher
      ? products.find(item => matcher.test(item.name || "") && item.inStock !== false)
      : undefined;

    if (product?.id) detectedProductIds.add(product.id);

    ctx.strokeStyle = product ? "#16A34A" : "#00FFFF";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    const label = product ? `${className}: ${product.name}` : className;
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = product ? "#16A34A" : "#00FFFF";
    ctx.fillRect(x, y, textWidth + 8, 22);
    ctx.fillStyle = "#000000";
    ctx.fillText(label, x + 4, y + 3);
  });

  detectedProductIds.forEach((productId) => {
    if (detectedItems.has(productId) || typeof dispatch !== "function") return;

    dispatch(addToCart({ productId }));
    detectedItems.add(productId);
    playBeep();

    const existingTimer = cooldownTimers.get(productId);
    if (existingTimer) clearTimeout(existingTimer);

    cooldownTimers.set(productId, setTimeout(() => {
      detectedItems.delete(productId);
      cooldownTimers.delete(productId);
    }, COOLDOWN_TIME));
  });
}
