const canvasGraph = document.getElementById("interval-control");
const contextGraph = canvasGraph.getContext("2d");
let interval_line_coordinates = [
    [0, 400],
    [400, 0],
  ],
  isDragging = false,
  isBegin = true,
  circleSelected = -1;

window.onload = function () {
  removeLine();
  drawLine();
  drawCircle();

  canvasGraph.onmousedown = canvaClick;
  canvasGraph.onmouseup = stopDragging;
  canvasGraph.onmouseout = stopDragging;
  canvasGraph.onmousemove = dragCircle;
};

function canvaClick(event) {
  const rect = canvasGraph.getBoundingClientRect();
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
    let x = e.pageX - canvasGraph.offsetLeft;
    let y = e.pageY - canvasGraph.offsetTop;
    interval_line_coordinates[circleSelected] = [x, y];
    removeLine();
    drawLine();
    drawCircle();
  }
}

function removeLine() {
  contextGraph.clearRect(0, 0, canvasGraph.width, canvasGraph.height);
  contextGraph.strokeStyle = "#2d3748";
  contextGraph.lineWidth = 2;

  contextGraph.beginPath();
  contextGraph.moveTo(0, 400);
  contextGraph.lineTo(400, 0);
  contextGraph.stroke();
}

function drawLine() {
  contextGraph.strokeStyle = "#a0aec0";
  contextGraph.lineWidth = 2;

  contextGraph.beginPath();
  contextGraph.moveTo(0, 400);
  for (let i = 0; i < interval_line_coordinates.length; i++)
    contextGraph.lineTo(...interval_line_coordinates[i]);
  contextGraph.lineTo(400, 0);
  contextGraph.stroke();
}

function drawCircle() {
  const circleSize = 4;
  contextGraph.fillStyle = "#718096";
  contextGraph.strokeStyle = "#a0aec0";
  contextGraph.lineWidth = 2;

  for (let i = 0; i < interval_line_coordinates.length; i++) {
    contextGraph.beginPath();
    contextGraph.arc(
      interval_line_coordinates[i][0],
      interval_line_coordinates[i][1],
      circleSize,
      0,
      Math.PI * 2,
      true
    );
    contextGraph.fill();
    contextGraph.stroke();
  }
}
