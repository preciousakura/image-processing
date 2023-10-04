let lastPositionX, lastPositionY;

function changeRadius(e) {
  radius = e;
}

function eraser_hold(e) {
  const rect = canvas_eraser_pincel.getBoundingClientRect();
  lastPositionX = e.pageX - rect.left;
  lastPositionY = e.pageY - rect.top;
  is_erasing = true;
}

function eraser_click(e) {}

function eraser_drop() {
  is_erasing = false;
}

function eraser_drag(e) {
  clear()
  const rect = canvas_eraser_pincel.getBoundingClientRect();
  let x = e.pageX - rect.left;
  let y = e.pageY - rect.top;

  context_eraser_pincel.strokeStyle = "red";
  context_eraser_pincel.beginPath();
  context_eraser_pincel.rect(x - radius, y - radius, radius * 2, radius * 2); // rect(x, y, side)
  context_eraser_pincel.stroke();

  if(is_erasing) {
    erased_image_data.erase(x, y, radius);
  }
}

function clear() {
  context_eraser_pincel.clearRect(0, 0, canvas_eraser_pincel.width, canvas_eraser_pincel.height);
}