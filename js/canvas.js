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
var circles = [], isDragging = false, selectedCircle = -1;

window.onload = function () {
  applyChanges();
  canvas_pl.onmousedown = hold;
  canvas_pl.onmouseup = drop;
  canvas_pl.onmouseout = drop;
  canvas_pl.onmousemove = drag;
};

function undo() {
  if(!orchestrator) return;
  orchestrator.undo();
  circles = [];
}
