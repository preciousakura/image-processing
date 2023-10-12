const canvas_histogram = document.getElementById("histogram");
const context_histogram = canvas_histogram.getContext("2d", { willReadFrequently: true });
let current_channel_histogram = "intensity";

function drawHistogram(histogram) {
  const { color } = histogram_channels[current_channel_histogram];

  let maxFrequency = 0;
  for (let i = 0; i < 256; i++)
    maxFrequency = Math.max(maxFrequency, histogram[i]);

  context_histogram.clearRect(0, 0, canvas_histogram.width, canvas_histogram.height);

  const guideHeight = 8;
  const startY = canvas_histogram.height - guideHeight;
  const dx = canvas_histogram.width / 256;
  const dy = canvas_histogram.height / maxFrequency;

  context_histogram.lineWidth = dx;
  context_histogram.fillStyle = "transparent";
  context_histogram.fillRect(0, 0, canvas_histogram.width, canvas_histogram.height);

  for (let i = 0; i < 256; i++) {
    const x = i * dx;
    context_histogram.strokeStyle = color;
    context_histogram.beginPath();
    context_histogram.moveTo(x, startY);
    context_histogram.lineTo(x, startY - histogram[i] * dy);
    context_histogram.closePath();
    context_histogram.stroke();

    context_histogram.strokeStyle = "rgb(" + i + ", " + i + ", " + i + ")";
    context_histogram.beginPath();
    context_histogram.moveTo(x, startY);
    context_histogram.lineTo(x, canvas_histogram.height);
    context_histogram.closePath();
    context_histogram.stroke();
  }
}

function changeHistogram(value) {
  if (orchestrator) {
    current_channel_histogram = value;
    orchestrator.changeHistogramChannel(histogram_channels[value].comp);
  }
}
