const canvas_piecewise_linear = document.getElementById("piecewise-linear-window");
const context_piecewise_linear = canvas_piecewise_linear.getContext('2d', { willReadFrequently: true });
let interval_line_coordinates = [[0, 400], [400, 0]],
    isDragging = false,
    isBegin = true,
    circleSelected = -1;

window.onload = function () {
  removeLine();
  drawLine();
  drawCircle();

  canvas_piecewise_linear.onmousedown = canvaClick;
  canvas_piecewise_linear.onmouseup = stopDragging;
  canvas_piecewise_linear.onmouseout = stopDragging;
  canvas_piecewise_linear.onmousemove = dragCircle;
};

function canvaClick(event) {
  const rect = canvas_piecewise_linear.getBoundingClientRect();
  const x = event.clientX - rect.left,
    y = event.clientY - rect.top;

  for (let i = 0; i < interval_line_coordinates.length; i++) {
    const circle = interval_line_coordinates[i];
    const distance_center = Math.sqrt(
      Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2)
    );

    if (distance_center <= 10) {
      circleSelected = i;
      isDragging = true;
      return;
    } else circleSelected = -1;
  }

  if (circleSelected == -1) {
    removeLine();
    if (isBegin) {
      circleSelected = 0;
      interval_line_coordinates[0] = [x, y];
      isBegin = false;
    } else {
      circleSelected = 1;
      interval_line_coordinates[1] = [x, y];
      isBegin = true;
    }

    isDragging = true;
    drawLine();
    drawCircle();
  }
}

function stopDragging() {
  isDragging = false;
}

function dragCircle(e) {
  if (isDragging == true && circleSelected != -1) {
    let x = e.pageX - canvas_piecewise_linear.offsetLeft;
    let y = e.pageY - canvas_piecewise_linear.offsetTop;
    interval_line_coordinates[circleSelected] = [x, y];
    removeLine();
    drawLine();
    drawCircle();
  }
}

function removeLine() {
  context_piecewise_linear.clearRect(0, 0, canvas_piecewise_linear.width, canvas_piecewise_linear.height);
  context_piecewise_linear.strokeStyle = "#2d3748";
  context_piecewise_linear.lineWidth = 2;

  context_piecewise_linear.beginPath();
  context_piecewise_linear.moveTo(0, 400);
  context_piecewise_linear.lineTo(400, 0);
  context_piecewise_linear.stroke();
}

function drawLine() {
  context_piecewise_linear.strokeStyle = "#a0aec0";
  context_piecewise_linear.lineWidth = 2;

  context_piecewise_linear.beginPath();
  context_piecewise_linear.moveTo(0, 400);
  for (let i = 0; i < interval_line_coordinates.length; i++)
    context_piecewise_linear.lineTo(...interval_line_coordinates[i]);
  context_piecewise_linear.lineTo(400, 0);
  context_piecewise_linear.stroke();
}

function drawCircle() {
  const circleSize = 4;
  context_piecewise_linear.fillStyle = "#718096";
  context_piecewise_linear.strokeStyle = "#a0aec0";
  context_piecewise_linear.lineWidth = 2;

  for (let i = 0; i < interval_line_coordinates.length; i++) {
    context_piecewise_linear.beginPath();
    context_piecewise_linear.arc(
      interval_line_coordinates[i][0],
      interval_line_coordinates[i][1],
      circleSize,
      0,
      Math.PI * 2,
      true
    );
    context_piecewise_linear.fill();
    context_piecewise_linear.stroke();
  }
}
