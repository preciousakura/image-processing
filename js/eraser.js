let lastPositionX, lastPositionY, erased_image_data;
const pencil_type = document.getElementsByName('typepencil');
const smooth_options = Array.from(document.getElementsByClassName('smoothoption'))

let lastImg;
let op = 0, original_width, original_height;
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

function changeDimension(e) {
  dimension = Number(e);
}

function applyFFT(matrix){
  if(op == 2){
    let aux = nj.fft(matrix);
    fft_result = aux.tolist();
  }else if(op == 1){
    fft_result = fft2(matrix);
  }else{
    fft_result = naive_fft2(matrix);
  }

  fft_result = fftshift(fft_result);
}

function applyIFFT(){
  fft_result = fftishift(fft_result);
  if(op == 2){
    let aux = nj.ifft(fft_result);
    fft_result = aux.tolist();
  }else if(op == 1){
    fft_result = fft2(fft_result, true);
  }else{
    fft_result = naive_fft2(fft_result, true);
  }
}

function fftApply(method) {
  op = method;
  if(orchestrator) {
    let matrix = []

    lastImg = orchestrator.imageHistory[orchestrator.imageHistory.length - 1].copyImage();

    original_width = lastImg.width;
    original_height = lastImg.height;

    lastImg.intensityTransform(toGrayW);
    lastImg.matrix.forEach(row => {
      const line = []
      row.forEach(col => {
        line.push((op==2 ? [col.r, 0] : col.r));
      })
      matrix.push(line);
    })

    //applyFFT
    applyFFT(matrix);
    let pixels_fft = []

    fft_result.forEach(row => {
      row.forEach(col => {
        let comp = (op == 2 ? col[0] : col.a);
        pixels_fft.push(Math.round(comp * 255))
        pixels_fft.push(Math.round(comp * 255))
        pixels_fft.push(Math.round(comp * 255))
        pixels_fft.push(255)
      })
    })

    lastImg = new image(pixels_fft, fft_result[0].length, fft_result.length);
    lastImg.normalize();
    lastImg.intensityTransform(gamma(2, 1.75));

    canvas_eraser.width = lastImg.width, canvas_eraser.height = lastImg.height;
    canvas_eraser_pincel.width = lastImg.width, canvas_eraser_pincel.height = lastImg.height;

    const data_image = context_eraser.getImageData(0, 0, lastImg.width, lastImg.height);
    erased_image_data = new imageOrchestrator(data_image, context_eraser, canvas_eraser, false);
    erased_image_data.addImage(lastImg);
    
    openModal('erasermodal')
  }
}

function applyInverseFft() {
  applyIFFT();
  let pixels_fft = []

  for(let i = 0; i < original_height; i++){
    for(let j = 0; j < original_width; j++){
      let comp = (op == 2 ? fft_result[i][j][0] : fft_result[i][j].a);
      pixels_fft.push(Math.round(comp * 255))
      pixels_fft.push(Math.round(comp * 255))
      pixels_fft.push(Math.round(comp * 255))
      pixels_fft.push(255)
    }
  }

  let lastImg = new image(pixels_fft, original_width, original_height);

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
  clear()
  is_erasing = false;
}

function eraser_drag(e) {
  clear()
  const rect = canvas_eraser_pincel.getBoundingClientRect();
  let x = e.pageX - rect.left;
  let y = e.pageY - rect.top;

  context_eraser_pincel.strokeStyle = "red";
  context_eraser_pincel.beginPath();
  context_eraser_pincel.rect(x - dimension/2, y - dimension/2, dimension, dimension); // rect(x, y, side)
  context_eraser_pincel.stroke();

  if(is_erasing) {
    erased_image_data.erase(x, y, dimension, pencil_color);
    const kernel = current_pencil === 'rough' ? Array(dimension).fill(Array(dimension).fill(pencil_color)) : [];
    applyKernelPixel(kernel, Math.round(kernel.length/2), Math.round(kernel.length/2), x, y);
  }
}

function clear() {
  context_eraser_pincel.clearRect(0, 0, canvas_eraser_pincel.width, canvas_eraser_pincel.height);
}

function applyKernelPixel(k, ki, kj, i, j) {
  let n = k.length; //kernel dimension is n x n
  let i_min = i - ki,
    i_max = i + n - ki - 1;
  let j_min = j - kj,
    j_max = j + n - kj - 1;
  for (let x = i_min, i = 0; x <= i_max; i++, x++)
    for (let y = j_min, j = 0; y <= j_max; j++, y++) {
      if(!lastImg.pixelInImage(x, y))
        continue;
      fft_result[x][y] *= k[i][j];
    }
}