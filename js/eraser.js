let lastPositionX,
  lastPositionY,
  radius = 25;

function eraser_hold(e) {
  const rect = canvas_eraser.getBoundingClientRect();
  lastPositionX = e.pageX - rect.left;
  lastPositionY = e.pageY - rect.top;
  is_erasing = true;
}

function eraser_click(e) {}

function eraser_drop() {
  is_erasing = false;
}

function eraser_drag(e) {
  if (is_erasing) {
    const rect = canvas_eraser.getBoundingClientRect();
    let x = e.pageX - rect.left;
    let y = e.pageY - rect.top;

    erased_image_data.coloredBox(x, y, radius);
  }
}
