function drawHistogram() {
  if (image) {
    context_h.clearRect(0, 0, canvas_h.width, canvas_h.height);
    
    const guideHeight = 8;
    const startY = canvas_h.height - guideHeight,
      dx = canvas_h.width / 256,
      dy = canvas_h.height / image.maxBrightness;

    context_h.lineWidth = dx;
    context_h.fillStyle = "transparent";
    context_h.fillRect(0, 0, canvas_h.width, canvas_h.height);

    for (let i = 0; i < 256; i++) {
      const x = i * dx;
      context_h.strokeStyle = "#4a5568";
      context_h.beginPath();
      context_h.moveTo(x, startY);
      context_h.lineTo(x, startY - image.histogram[i] * dy);
      context_h.closePath();
      context_h.stroke();

      context_h.strokeStyle = "rgb(" + i + ", " + i + ", " + i + ")";
      context_h.beginPath();
      context_h.moveTo(x, startY);
      context_h.lineTo(x, canvas_h.height);
      context_h.closePath();
      context_h.stroke();
    }
  }
}
