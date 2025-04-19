
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const toolSelect = document.getElementById("tool");
const watermarkInput = document.getElementById("watermark");
const iaEffect = document.getElementById("iaEffect");

let image = null;
let isDrawing = false;

upload.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        drawCanvas();
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function drawCanvas() {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
  if (iaEffect.value !== "none") addIAEffect(iaEffect.value);
}

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return {
    x: (x * canvas.width) / rect.width,
    y: (y * canvas.height) / rect.height
  };
}

function drawAt(x, y) {
  const size = 12;
  const tool = toolSelect.value;
  if (tool === "draw") {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  } else if (tool === "pixel") {
    const imgData = ctx.getImageData(x, y, size, size);
    let r = 0, g = 0, b = 0;
    const total = imgData.data.length / 4;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
    }
    r /= total; g /= total; b /= total;
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
    }
    ctx.putImageData(imgData, x, y);
  }
}

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing || !image) return;
  const { x, y } = getPointerPos(e);
  drawAt(x, y);
});

canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchcancel", () => isDrawing = false);
canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing || !image) return;
  const { x, y } = getPointerPos(e);
  drawAt(x, y);
}, { passive: false });

watermarkInput.addEventListener("input", () => {
  if (image) drawCanvas();
});

function addWatermark(text) {
  if (!text || !canvas.width || !canvas.height) return;
  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.rotate(-0.2);
  for (let y = 100; y < canvas.height; y += 180) {
    for (let x = 0; x < canvas.width; x += 300) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();
}

function addIAEffect(effect) {
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  if (effect === "waves") {
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        ctx.lineTo(x, y + 5 * Math.sin(x * 0.05));
      }
      ctx.stroke();
    }
  } else if (effect === "lines") {
    for (let i = 0; i < 50; i++) {
      const offset = i * 10;
      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(canvas.width, offset + (i % 2 === 0 ? 15 : -15));
      ctx.stroke();
    }
  } else if (effect === "distort") {
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function resetCanvas() {
  if (image) drawCanvas();
}

function download() {
  const a = document.createElement("a");
  a.download = "ci-protegida.png";
  a.href = canvas.toDataURL();
  a.click();
}
