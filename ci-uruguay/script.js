
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const toolSelect = document.getElementById("tool");
const watermarkInput = document.getElementById("watermark");
const iaEffect = document.getElementById("iaEffect");
const overlay = document.getElementById("overlay");
const dropZone = document.getElementById("drop-zone");

let isDrawing = false;
let image = null;

// Asegurar el input funcione en móviles
upload.addEventListener("change", (e) => {
  if (!e.target.files || !e.target.files[0]) {
    alert("No se pudo cargar la imagen. Probá nuevamente.");
    return;
  }
  handleUpload(e);
});

// Drag & drop
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
  upload.files = e.dataTransfer.files;
  handleUpload({ target: upload });
});

function handleUpload(e) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      applyEffects();
    };
    image.src = evt.target.result;
  };
  const file = e.target.files[0];
  if (!file) return;
  reader.readAsDataURL(file);
}

function applyEffects() {
  if (!image) return;
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
  addIAEffect(iaEffect.value);
}

function drawAt(x, y) {
  const size = 12;
  const tool = toolSelect.value;
  if (tool === "draw") {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  } else if (tool === "pixel") {
    const imgData = ctx.getImageData(x, y, size, size);
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
    }
    const count = imgData.data.length / 4;
    r /= count; g /= count; b /= count;
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
    }
    ctx.putImageData(imgData, x, y);
  }
}

function handlePointerMove(e) {
  if (!isDrawing || !image) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  drawAt(x, y);
}

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", handlePointerMove);
canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  handlePointerMove(e);
}, { passive: false });

watermarkInput.addEventListener("input", applyEffects);
iaEffect?.addEventListener("change", applyEffects);

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
  if (!image || effect === "none") return;

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
  applyEffects();
}

function download() {
  const a = document.createElement("a");
  a.download = "ci-protegida.png";
  a.href = canvas.toDataURL();
  a.click();
}
