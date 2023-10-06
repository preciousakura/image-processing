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

// eraser
var canvas_eraser_pincel = document.getElementById('eraser_pincel');
var context_eraser_pincel = canvas_eraser_pincel.getContext('2d', { willReadFrequently: true })

var canvas_eraser = document.getElementById('eraser');
var context_eraser = canvas_eraser.getContext('2d', { willReadFrequently: true })
var is_erasing = false;
var radius = 3;

window.onload = function () {
  applyChanges();
  canvas_pl.onmousedown = hold;
  canvas_pl.onmouseup = drop;
  canvas_pl.onmouseout = drop;
  canvas_pl.onmousemove = drag;
  canvas_pl.ondblclick = dblclick;

  canvas_eraser_pincel.onmousedown = eraser_hold;
  canvas_eraser_pincel.onmouseup = eraser_drop;
  canvas_eraser_pincel.onmouseout = eraser_drop;
  canvas_eraser_pincel.onmousemove = eraser_drag;  
  canvas_eraser_pincel.onclick = eraser_click;
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
  modal.style.display = "flex";
}
