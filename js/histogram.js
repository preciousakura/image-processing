let histogram_channels = {
  intensity: {
    color: "#4a5568",
    comp: 0,
  },
  red: {
    color: "red",
    comp: 0,
  },
  green: {
    color: "green",
    comp: 1,
  },
  blue: {
    color: "blue",
    comp: 2,
  },
};

let current_channel_histogram = "intensity";

function drawHistogram(histogram) {
  const { color } = histogram_channels[current_channel_histogram];


  let maxFrequency = 0;
  for (let i = 0; i < 256; i++)
    maxFrequency = Math.max(maxFrequency, histogram[i]);

  context_h.clearRect(0, 0, canvas_h.width, canvas_h.height);

  const guideHeight = 8;
  const startY = canvas_h.height - guideHeight;
  const dx = canvas_h.width / 256;
  const dy = canvas_h.height / maxFrequency;

  context_h.lineWidth = dx;
  context_h.fillStyle = "transparent";
  context_h.fillRect(0, 0, canvas_h.width, canvas_h.height);

  for (let i = 0; i < 256; i++) {
    const x = i * dx;
    context_h.strokeStyle = color;
    context_h.beginPath();
    context_h.moveTo(x, startY);
    context_h.lineTo(x, startY - histogram[i] * dy);
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

function changeHistogram(value) {
  if (orchestrator) {
    current_channel_histogram = value;
    orchestrator.changeHistogramChannel(histogram_channels[value].comp);
  }
}
