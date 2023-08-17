const canvasHist = document.getElementById("histogram-window");
const contextHist = canvasHist.getContext('2d', { willReadFrequently: true });

function drawHistogram() {
  if (image) {
    contextHist.clearRect(0, 0, canvasHist.width, canvasHist.height);
    
    const guideHeight = 8;
    const startY = canvasHist.height - guideHeight,
      dx = canvasHist.width / 256,
      dy = canvasHist.height / image.maxBrightness;

    contextHist.lineWidth = dx;
    contextHist.fillStyle = "transparent";
    contextHist.fillRect(0, 0, canvasHist.width, canvasHist.height);

    for (let i = 0; i < 256; i++) {
      const x = i * dx;
      contextHist.strokeStyle = "#4a5568";
      contextHist.beginPath();
      contextHist.moveTo(x, startY);
      contextHist.lineTo(x, startY - image.histogram[i] * dy);
      contextHist.closePath();
      contextHist.stroke();

      contextHist.strokeStyle = "rgb(" + i + ", " + i + ", " + i + ")";
      contextHist.beginPath();
      contextHist.moveTo(x, startY);
      contextHist.lineTo(x, canvasHist.height);
      contextHist.closePath();
      contextHist.stroke();
    }
  }
}
