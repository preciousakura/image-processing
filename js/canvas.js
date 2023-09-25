var modal;

// image
var orchestrator;
var canvas_img = document.getElementById("image");
var context_img = canvas_img.getContext("2d", { willReadFrequently: true });

// histogram
var canvas_h = document.getElementById("histogram-window");
var context_h = canvas_h.getContext("2d", { willReadFrequently: true });

// piecewise linear
var canvas_pl = document.getElementById("piecewise-linear-window");
var context_pl = canvas_pl.getContext("2d", { willReadFrequently: true });
var circles = [[0, canvas_pl.height], [canvas_pl.width, 0]], isDragging = false, selectedCircleDrag = -1, selectedCircle = -1;
var valueX = document.getElementById("valueX")
var valueY = document.getElementById("valueY")

window.onload = function () {
  applyChanges();
  canvas_pl.onmousedown = hold;
  canvas_pl.onmouseup = drop;
  canvas_pl.onmouseout = drop;
  canvas_pl.onmousemove = drag;
  canvas_pl.ondblclick = dblclick;
};

function undo() {
  if(!orchestrator) return;
  orchestrator.undo();
  circles = [];
}

function closeModal() {
  if(orchestrator){
    orchestrator.recoverLastImage();
    orchestrator.showChanges();
  }
  modal.style.display = "none";
}

function openModal(value) {
  if(modal) modal.style.display = "none";
  modal = document.getElementById(value)
  modal.style.display = "block";
}
