
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const watermarkInput = document.getElementById('watermark');
const toolSelect = document.getElementById('tool');
let isDrawing = false;
let image = null;

upload.addEventListener('change', (e) => {
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
});

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || !image) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const tool = toolSelect.value;
  const size = 10;

  if (tool === 'draw') {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    const imgData = ctx.getImageData(x, y, size, size);
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
    }
    const count = imgData.data.length / 4;
    r /= count;
    g /= count;
    b /= count;
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
    }
    ctx.putImageData(imgData, x, y);
  }
});

watermarkInput.addEventListener('input', () => {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
});

function addWatermark(text) {
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.rotate(-0.2);
  for (let y = 100; y < canvas.height; y += 200) {
    for (let x = 0; x < canvas.width; x += 400) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.rotate(0.2);
}

function resetCanvas() {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  addWatermark(watermarkInput.value);
}

function download() {
  const link = document.createElement('a');
  link.download = 'ci-protegida.png';
  link.href = canvas.toDataURL();
  link.click();
}
