
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const dropZone = document.getElementById("drop-zone");
const toolSelect = document.getElementById("tool");
const watermarkInput = document.getElementById("watermark");
const iaEffect = document.getElementById("iaEffect");
const overlay = document.getElementById("overlay");

let image = null;
let isDrawing = false;

// 📂 Carga por input convencional
upload.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  loadImage(file);
});

// 📂 Carga por drag & drop
dropZone.addEventListener("click", () => upload.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("active");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("active");
  const file = e.dataTransfer.files?.[0];
  if (file) loadImage(file);
});

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      addWatermark(watermarkInput.value);
      if (iaEffect) addIAEffect(iaEffect.value);
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 🖍️ Herramientas: pincel y pixelado
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

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const px = e.touches ? e.touches[0].clientX : e.clientX;
  const py = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (px - rect.left) * (canvas.width / rect.width),
    y: (py - rect.top) * (canvas.height / rect.height)
  };
}

// Eventos de dibujo
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing || !image) return;
  const { x, y } = getPointerPos(e);
  drawAt(x, y);
});

canvas.addEventListener("touchstart", (e) => {
  isDrawing = true;
  e.preventDefault();
});
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDrawing || !image) return;
  const { x, y } = getPointerPos(e);
  drawAt(x, y);
}, { passive: false });

watermarkInput.addEventListener("input", () => {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
  if (iaEffect) addIAEffect(iaEffect.value);
});

function addWatermark(text) {
  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.15)";
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
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
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
      ctx.beginPath();
      const offset = i * 10;
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
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
  if (iaEffect) addIAEffect(iaEffect.value);
}

function download() {
  const a = document.createElement("a");
  a.download = "ci-protegida.png";
  a.href = canvas.toDataURL();
  a.click();
}
