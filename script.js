
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const toolSelect = document.getElementById("tool");
const watermarkInput = document.getElementById("watermark");
const overlay = document.getElementById("overlay");
const toggleOverlay = document.getElementById("toggleOverlay");
const dropArea = document.getElementById("drop-area");

let isDrawing = false;
let image = null;

upload.addEventListener("change", handleUpload);
dropArea.addEventListener("click", () => upload.click());
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#003c70";
});
dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#0057A8";
});
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
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
      addWatermark(watermarkInput.value);
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
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

function addWatermark(text) {
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.rotate(-0.2);
  for (let y = 100; y < canvas.height; y += 180) {
    for (let x = 0; x < canvas.width; x += 300) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.rotate(0.2);
}

watermarkInput.addEventListener("input", () => {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
});

toggleOverlay.addEventListener("change", () => {
  overlay.style.display = toggleOverlay.checked ? "block" : "none";
});

function resetCanvas() {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
}

function download() {
  const a = document.createElement("a");
  a.download = "ci-protegida.png";
  a.href = canvas.toDataURL();
  a.click();
}
