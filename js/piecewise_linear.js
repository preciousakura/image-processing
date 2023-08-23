function hold(event) {
  if(image) {
    const rect = canvas_pl.getBoundingClientRect();
    let x = event.clientX - rect.left, y = event.clientY - rect.top;
    
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const distance_center = Math.sqrt(Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2));
    
      if (distance_center <= 10) {
        selectedCircle = i;
        isDragging = true;
        return;
      } 
    }
    
    if (selectedCircle == -1 && circles.length < 2) {
      if (circles.length > 0 && circles[0][0] > x)
        x = circles[0][0];
      circles.push([x, y]);
    }
    applyChanges();
  }
}

function drop() {
  isDragging = false;
  selectedCircle = -1;
}

function drag(e) {
  if (isDragging  && selectedCircle != -1) {
    let x = e.pageX - canvas_pl.offsetLeft;
    let y = e.pageY - canvas_pl.offsetTop;

    if (selectedCircle === 1 && circles[0][0] > x)
      x = circles[0][0];
    else if (selectedCircle === 0 && circles.length > 1 && circles[1][0] < x)
      x = circles[1][0];

    circles[selectedCircle] = [x, y];
    applyChanges();
  }
}

function applyChanges() {
  context_pl.clearRect(0, 0, canvas_pl.width, canvas_pl.height);
  drawLine();
  
  if(circles.length > 0) {
    drawCircle();
    if(image) {
      if(circles.length > 1) image.piecewiseLinear(circles[0], circles[1], canvas_pl.width, canvas_pl.height);
      else image.piecewiseLinear(circles[0], undefined, canvas_pl.width, canvas_pl.height);
      drawHistogram();
    }
  } 
}

function drawLine() {
  context_pl.lineWidth = 2;

  context_pl.strokeStyle = "#2d3748";
  context_pl.beginPath();
  context_pl.moveTo(0, canvas_pl.height);
  context_pl.lineTo(canvas_pl.width, 0);
  context_pl.stroke();
  
  context_pl.strokeStyle = "#a0aec0";
  context_pl.beginPath();
  context_pl.moveTo(0, canvas_pl.height);
  for (let i = 0; i < circles.length; i++)
    context_pl.lineTo(...circles[i]);
  context_pl.lineTo(canvas_pl.width, 0);
  context_pl.stroke();
}

function drawCircle() {
  const circleSize = 4;
  context_pl.fillStyle = "#718096";
  context_pl.strokeStyle = "#a0aec0";
  context_pl.lineWidth = 2;

  for (let i = 0; i < circles.length; i++) {
    context_pl.beginPath();
    context_pl.arc(circles[i][0], circles[i][1], circleSize, 0, Math.PI * 2, true);
    context_pl.fill();
    context_pl.stroke();
  }
}
