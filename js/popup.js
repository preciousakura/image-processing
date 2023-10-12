const main = document.getElementById("main");
let popup,
  popup_options,
  isPopupMoving = false,
  pos_x,
  pos_y;

let histogram_isPopupMoving = false;
const histogram_popup_options = document.getElementById("histogramPopup_options");
const histogram_popup = document.getElementById("histogramPopup");
const icon = document.getElementById("icon_histogram");

histogram_popup_options.addEventListener("mouseup", (_) => { histogram_isPopupMoving = false; });
histogram_popup_options.addEventListener("mouseout", (_) => { histogram_isPopupMoving = false; });
histogram_popup_options.addEventListener("mousedown", (event) => { 
    pos_x = event.clientX - histogram_popup.offsetLeft; 
    pos_y = event.clientY - histogram_popup.offsetTop;
    histogram_isPopupMoving = true;
});

main.addEventListener("mousemove", (event) => {
    const width = Math.round(pos_x);
    const height = Math.round(pos_y);
    let x = event.clientX - width,
        y = event.clientY - height;

  if (isPopupMoving) {
    popup.style.removeProperty("left");
    popup.style.removeProperty("top");

    let left = popup.style.left + x;
    let top = popup.style.top + y;

    popup.style.left = left;
    popup.style.top = top;
  }

  if(histogram_isPopupMoving) {
    histogram_popup.style.removeProperty("left");
    histogram_popup.style.removeProperty("top");

    let left = histogram_popup.style.left + x;
    let top = histogram_popup.style.top + y;

    histogram_popup.style.left = left;
    histogram_popup.style.top = top;
  }
});

function openPopup(value) {
  if (orchestrator) {
    if (popup) popup.style.display = "none";
    popup = document.getElementById(value);
    popup_options = document.getElementById(value + "_options");

    popup.style.display = "block";

    popup_options.addEventListener("mouseup", (_) => {
      isPopupMoving = false;
    });
    popup_options.addEventListener("mouseout", (_) => {
      isPopupMoving = false;
    });
    popup_options.addEventListener("mousedown", (event) => {
      pos_x = event.clientX - popup.offsetLeft;
      pos_y = event.clientY - popup.offsetTop;
      isPopupMoving = true;
    });
    closeSubmenu();
  }
}

function closePopup() {
  if (popup) popup.removeAttribute("style");
  if (orchestrator) {
    orchestrator.recoverLastImage();
    orchestrator.showChanges();
  }
  closeSubmenu();
}

function minimizeHistogram() {
  icon.removeEventListener('click', minimizeHistogram)
  icon.setAttribute('class', "ph ph-plus")
  icon.addEventListener('click', maximineHistogram)
  histogram_popup.style.left = main.offsetWidth - histogram_popup_options.offsetHeight - 32;
  histogram_popup.style.height = histogram_popup_options.offsetHeight;
  histogram_popup.style.minWidth = histogram_popup_options.offsetHeight;
  histogram_popup.style.width = histogram_popup_options.offsetHeight;
}

function maximineHistogram() {
  icon.removeEventListener('click', maximineHistogram)
  icon.setAttribute('class', "ph ph-minus")
  icon.addEventListener('click', minimizeHistogram)
  histogram_popup.removeAttribute("style");
}


