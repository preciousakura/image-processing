let lastPositionX, lastPositionY, erased_image_data;
const pencil_type = document.getElementsByName('typepencil');
const smooth_options = Array.from(document.getElementsByClassName('smoothoption'))

let current_pencil = 'rough';
let pencil_color = 0;
let fft_result = []

function onChangePencilColor(e) {
  pencil_color = e;
}

function onChangePencilType(e) {
  current_pencil = e;
  if(e === 'rough') {
    smooth_options.forEach((value) => {
      value.setAttribute("disabled", true);
    });
  } else {
    smooth_options.forEach((item) => {
      item.removeAttribute("disabled");
    });
  }
}

function changeRadius(e) {
  radius = e;
}

function fftApply() {
  if(orchestrator) {
    let matrix = []
    let lastImg = orchestrator.imageHistory[orchestrator.imageHistory.length - 1].copyImage();
    lastImg.intensityTransform(toGrayW);

    lastImg.matrix.forEach(row => {
      const line = []
      row.forEach(col => {
        line.push([col.r, 0])
      })
      matrix.push(line);
    })

    let aux = nj.fft(matrix);
    fft_result = aux.tolist();
    fft_result = fftshift(fft_result);
    let pixels_fft = []

    fft_result.forEach(row => {
      row.forEach(col => {
        pixels_fft.push(Math.round(col[0] * 255))
        pixels_fft.push(Math.round(col[0] * 255))
        pixels_fft.push(Math.round(col[0] * 255))
        pixels_fft.push(255)
      })
    })

    lastImg = new image(pixels_fft, lastImg.width, lastImg.height);
    lastImg.normalize();

    canvas_eraser.width = lastImg.width, canvas_eraser.height = lastImg.height;
    canvas_eraser_pincel.width = lastImg.width, canvas_eraser_pincel.height = lastImg.height;
    
    const data_image = context_eraser.getImageData(0, 0, lastImg.width, lastImg.height);
    erased_image_data = new imageOrchestrator(data_image, context_eraser, canvas_eraser, false);
    erased_image_data.addImage(lastImg);

    openModal('erasermodal')
  }
}

function applyInverseFft() {
  fft_result = fftishift(fft_result);
  let aux = nj.ifft(fft_result);
  fft_result = aux.tolist();
  let pixels_fft = []

  fft_result.forEach(row => {
    row.forEach(col => {
      pixels_fft.push(Math.round(col[0] * 255))
      pixels_fft.push(Math.round(col[0] * 255))
      pixels_fft.push(Math.round(col[0] * 255))
      pixels_fft.push(255)
    })
  })

  let lastImg = new image(pixels_fft, fft_result[0].length, fft_result.length);
  orchestrator.addImage(lastImg);
  closeModal();
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
    erased_image_data.erase(x, y, radius, pencil_color);
  }
}

function clear() {
  context_eraser_pincel.clearRect(0, 0, canvas_eraser_pincel.width, canvas_eraser_pincel.height);
}
