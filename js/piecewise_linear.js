let channels = {
  gray: {
    color: '#a0aec0',
    circles: [
      [0, canvas_pl.height],
      [canvas_pl.width, 0],
    ],
    piecewise: (px) => { return new pixel(piecewise(px.r), piecewise(px.g), piecewise(px.b), 1.0) }
  },
  red: {
    color: 'red',
    circles: [
      [0, canvas_pl.height],
      [canvas_pl.width, 0],
    ],
    piecewise: (px) => { return new pixel(piecewise(px.r), px.g, px.b, 1.0) }
  },
  green: {
    color: 'green',
    circles: [
      [0, canvas_pl.height],
      [canvas_pl.width, 0],
    ],
    piecewise: (px) => { return new pixel(px.r, piecewise(px.g), px.b, 1.0) }
  },
  blue: {
    color: 'blue',
    circles: [
      [0, canvas_pl.height],
      [canvas_pl.width, 0],
    ],
    piecewise: (px) => { return new pixel(px.r, px.g, piecewise(px.b), 1.0) }
  },
};

const radio_channel = document.getElementsByName("rgb");
const check_color_type = document.getElementById("scale_check");
let current_channel = "gray";

function changeColorType(e) {
  if (e) {
    radio_channel.forEach((value) => {
      value.setAttribute("disabled", true);
    });
    current_channel = 'gray';

  } else {
    radio_channel.forEach((value) => {
      value.removeAttribute("disabled");
    });
    const value = document.querySelector('input[name="rgb"]:checked').value;
    current_channel = value ?? 'red';
  }

  channels[current_channel].circles = channels[current_channel].circles
  applyChanges();
}

function changeChannel(e) {
  current_channel = e;
  channels[current_channel].circles = channels[current_channel].circles
  applyChanges();
}

function toCanvas(x, y) {
  return [
    (x * canvas_pl.width) / 255.0,
    canvas_pl.height - (y * canvas_pl.height) / 255.0,
  ];
}

function toCartesian(x, y) {
  return [
    Math.round(x / (canvas_pl.width / 255.0)),
    Math.round((canvas_pl.height - y) / (canvas_pl.height / 255.0)),
  ];
}

function toCartesian01(x, y) {
  let aux = toCartesian(x, y);
  aux[0] /= 255.0;
  aux[1] /= 255.0;
  return aux;
}

function organizedCircles() {
  const aux = channels[current_channel].circles.sort((a, b) => {
    return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
  });
  const removeIndex = new Set();

  for (let i = 1; i < aux.length; i++)
    if (aux[i][0] === aux[i - 1][0] && aux[i][1] === aux[i - 1][1])
      removeIndex.add(i);

  channels[current_channel].circles = [];

  for (let i = 0; i < aux.length; i++)
    if (!removeIndex.has(i)) channels[current_channel].circles.push(aux[i]);
}

function deselect() {
  if (selectedCircle !== -1) {
    selectedCircle = -1;
    applyChanges();
  }
}

function addcircle() {
  const circle = toCanvas(valueX.value, valueY.value);
  if (selectedCircle === -1) {
    channels[current_channel].circles.push([circle[0], circle[1]]);
    applyChanges();
  }
}

function changeX(value) {
  if (selectedCircle !== -1) {
    value = toCanvas(value, 1)[0];
    const x0 = selectedCircle - 1 >= 0 ? channels[current_channel].circles[selectedCircle - 1][0] : 0;
    const x1 =
      selectedCircle + 1 < channels[current_channel].circles.length
        ? channels[current_channel].circles[selectedCircle + 1][0]
        : canvas_pl.width;

    if (value < x0) value = x0;
    if (value > x1) value = x1;

    channels[current_channel].circles[selectedCircle][0] = value;
    applyChanges();
  }
}

function changeY(value) {
  if (selectedCircle !== -1) {
    channels[current_channel].circles[selectedCircle][1] = toCanvas(1, value)[1];
    applyChanges();
  }
}

function dblclick(event) {
  const rect = canvas_pl.getBoundingClientRect();
  let x = event.clientX - rect.left,
    y = event.clientY - rect.top;

  for (let i = 0; i < channels[current_channel].circles.length; i++) {
    const circle = channels[current_channel].circles[i];
    const distance_center = Math.sqrt(
      Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2)
    );

    if (distance_center <= 10) {
      if (selectedCircle === i) selectedCircle = -1;
      else selectedCircle = i;
      break;
    }
  }
  applyChanges();
}

function hold(event) {
  const rect = canvas_pl.getBoundingClientRect();
  let x = event.clientX - rect.left,
    y = event.clientY - rect.top;

  for (let i = 0; i < channels[current_channel].circles.length; i++) {
    const circle = channels[current_channel].circles[i];
    const distance_center = Math.sqrt(
      Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2)
    );

    if (distance_center <= 10) {
      selectedCircle = i;
      selectedCircleDrag = i;
      isDragging = true;
      break;
    }
  }

  if (selectedCircleDrag == -1) {
    channels[current_channel].circles.push([x, y]);
    applyChanges();
    const index = channels[current_channel].circles.findIndex((element) => {
      return element[0] === x && element[1] === y;
    });
    selectedCircle = index;
  }
  applyChanges();
}

function drop() {
  isDragging = false;
  selectedCircleDrag = -1;
}

function drag(e) {
  if (isDragging && selectedCircleDrag != -1) {
    const rect = canvas_pl.getBoundingClientRect();
    let x = e.pageX - rect.left;
    let y = e.pageY - rect.top;

    const x0 =
      selectedCircleDrag - 1 >= 0 ? channels[current_channel].circles[selectedCircleDrag - 1][0] : 0;
    const x1 =
      selectedCircleDrag + 1 < channels[current_channel].circles.length
        ? channels[current_channel].circles[selectedCircleDrag + 1][0]
        : canvas_pl.width;

    if (x < x0) x = x0;
    if (x > x1) x = x1;

    channels[current_channel].circles[selectedCircleDrag] = [x, y];
    applyChanges();
  }
}

function applyChanges() {
  context_pl.clearRect(0, 0, canvas_pl.width, canvas_pl.height);
  organizedCircles();
  drawLine();
  drawCircle();

  if (orchestrator) orchestrator.intensityTransform(piecewisePixel);
  if (selectedCircle !== -1) {
    const circletocartesian = toCartesian(
      channels[current_channel].circles[selectedCircle][0],
      channels[current_channel].circles[selectedCircle][1]
    );
    valueX.value = circletocartesian[0];
    valueY.value = circletocartesian[1];
  } else {
    valueX.value = "";
    valueY.value = "";
  }
}

function drawLine() {
  context_pl.lineWidth = 2;

  context_pl.strokeStyle = "#2d3748";
  context_pl.beginPath();
  context_pl.moveTo(0, canvas_pl.height);
  context_pl.lineTo(canvas_pl.width, 0);
  context_pl.stroke();

  context_pl.strokeStyle = channels[current_channel].color;
  context_pl.beginPath();

  context_pl.moveTo(0, channels[current_channel].circles[0][1]);
  for (let i = 0; i < channels[current_channel].circles.length; i++) context_pl.lineTo(...channels[current_channel].circles[i]);

  context_pl.lineTo(canvas_pl.width, channels[current_channel].circles[channels[current_channel].circles.length - 1][1]);
  context_pl.stroke();
}

function drawCircle() {
  const circleSize = 4;

  for (let i = 0; i < channels[current_channel].circles.length; i++) {
    if (i === selectedCircle) context_pl.fillStyle = "white";
    else context_pl.fillStyle = channels[current_channel].color;

    context_pl.beginPath();
    context_pl.arc(
      channels[current_channel].circles[i][0],
      channels[current_channel].circles[i][1],
      circleSize,
      0,
      Math.PI * 2,
      true
    );
    context_pl.fill();
  }
}

function closePiecewise() {
  (channels[current_channel].circles = [
    [0, canvas_pl.height],
    [canvas_pl.width, 0],
  ]),
    (isDragging = false),
    (selectedCircleDrag = -1),
    (selectedCircle = -1);
  selectedCircle = -1;
  applyChanges();

  closeModal();
}

//calculate piecewise

function lineEquation(p1, p2) {
  let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  let b = p2[1] - m * p2[0];
  return function (x) {
    return m * x + b;
  };
}

function binarySearch(x) {
  let l = -1,
    r = channels[current_channel].circles.length,
    mid;
  while (l < r - 1) {
    mid = Math.floor((l + r) / 2);
    if (toCartesian01(channels[current_channel].circles[mid][0], 0)[0] > x) r = mid;
    else l = mid;
  }
  return r;
}

function piecewise(x) {
  let index = binarySearch(x);
  let p1, p2;
  if (index == channels[current_channel].circles.length) {
    p1 = channels[current_channel].circles[channels[current_channel].circles.length - 1];
    p2 = [canvas_pl.width, p1[1]];
  } else if (index == 0) {
    p2 = channels[current_channel].circles[0];
    p1 = [0, p2[1]];
  } else {
    p1 = channels[current_channel].circles[index - 1];
    p2 = channels[current_channel].circles[index];
  }
  p1 = toCartesian01(p1[0], p1[1]);
  p2 = toCartesian01(p2[0], p2[1]);
  const le = lineEquation(p1, p2);
  return le(x);
}

function piecewisePixel(px) {
  // let imgaux = orchestrator.imageHistory[orchestrator.imageHistory.length - 1].copyImage();
  return channels[current_channel].piecewise(px);
}
