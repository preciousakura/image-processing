const canvas_transformations = document.getElementById("transformations-window");
const context_transformations = canvas_transformations.getContext("2d", { willReadFrequently: true });
const startX = 30, startY = 30;
let gamma_value = [startX + (255 / 10), startY + 20];
let gamma_is_dragging = false;

// window.onload = function () {
//   canvas_transformations.onmousedown = canva_click;
//   canvas_transformations.onmouseup = stop_dragging;
//   canvas_transformations.onmouseout = stop_dragging;
//   canvas_transformations.onmousemove = drag_circle;
//   draw_gamma_circle();
// };

function draw_gamma_circle() {
  context_transformations.clearRect(0, 0, canvas_transformations.width, canvas_transformations.height);
  context_transformations.fillStyle = "white";
  context_transformations.font = "normal 12px Arial";
  
  context_transformations.fillText(`${((gamma_value[0] - 30)/255 * 10).toFixed(2)}`, startX + 232, startY);
  context_transformations.fillText("Correção de gamma", startX, startY);

  context_transformations.strokeStyle = "#59b8de";
  context_transformations.lineWidth = 8;

  context_transformations.beginPath();
  context_transformations.moveTo(startX, startY + 20);
  context_transformations.lineTo(startX + 255, startY + 20);
  context_transformations.stroke();

  const circleSize = 4;
  context_transformations.fillStyle = "#59b8de";
  context_transformations.beginPath();
  context_transformations.arc(gamma_value[0], gamma_value[1], circleSize, 0, Math.PI * 2, true);
  context_transformations.fill();
  context_transformations.stroke();
  
  if(image)  {
    image.gammaCorrection((gamma_value[0] - 30)/255 * 10)
    drawHistogram();
  }
}

function canva_click(event) {
    if(image) {
        const rect = canvas_transformations.getBoundingClientRect();
        let x = event.clientX - rect.left,
            y = startY + 20;
      
        const circle = gamma_value;
        const distance_center = Math.sqrt(Math.pow(circle[0] - x, 2) + Math.pow(circle[1] - y, 2));
      
        if (distance_center <= 10) gamma_is_dragging = true;
    }
}

function stop_dragging() {
  gamma_is_dragging = false;
}

function drag_circle(e) {
  if (gamma_is_dragging) {
    let x = e.pageX - canvas_transformations.offsetLeft;
    if(x > startX + 255) x = startX + 255;
    else if(x < startX) x = startX
    gamma_value[0] = x;
    draw_gamma_circle();
  }
}