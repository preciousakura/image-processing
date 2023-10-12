var orchestrator;
var canvas_img = document.getElementById("image");
var context_img = canvas_img.getContext("2d", { willReadFrequently: true });

var histogram_channels;

window.onload = function () {
  reset_values();
};

function reset_values() {
  applyChanges();
  histogram_channels = {
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
}

function undo() {
  if (!orchestrator) return;
  orchestrator.undo();
}

function apply() {
  if (!orchestrator) return;
  orchestrator.do();
  closePopup();
}
