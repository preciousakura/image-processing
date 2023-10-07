let image_chromaK;
let r_picked = 0, g_picked = 255, b_picked = 1;

const r_picker = document.getElementById("r_picker");
const g_picker = document.getElementById("g_picker");
const b_picker = document.getElementById("b_picker");
const picked_color = document.getElementById("picked-color");
let distance = 0;
let isPicking = false;

function onChangeR(value) {
  picked_color.style.background = `rgb(${value}, ${g_picked}, ${b_picked})`;
  r_picked = value;
}
function onChangeG(value) {
  picked_color.style.background = `rgb(${r_picked}, ${value}, ${b_picked})`;
  g_picked = value;
}
function onChangeB(value) {
  picked_color.style.background = `rgb(${r_picked}, ${g_picked}, ${value})`;
  b_picked = value;
}

function onChangeDistance(value) {
  distance = value;
}

const loadChromaKeyImage = (event) => {
  if (orchestrator) {
    if (event.target.files.length > 0) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);

      img.addEventListener("load", () => {
        let width = canvas_img.width;
        let height = (width / img.width) * img.height;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        const data_image = context.getImageData(0, 0, width, height);
        image_chromaK = new image(data_image.data, width, height);
        openModal("pickerchromakey");
        img.style.display = "none";

        canvas.remove();
      });
    }
  }
};

function chromaKeyApply() {
  orchestrator.chromaKey(
    image_chromaK,
    new pixel(r_picked, g_picked, b_picked, 1),
    distance
  );
  closeChromaKey();
}

function closeChromaKey() {
  isPicking = false;
  image_chromaK = undefined;
  r_picked = 0, g_picked = 255, b_picked = 1;
  closeModal();
}

function pick() {
  isPicking = true;
}

function pick_move(event) {
  if (isPicking) {
    const rect = canvas_img.getBoundingClientRect();
    let x = event.clientX - rect.left,
      y = event.clientY - rect.top;

    const pixel = context_img.getImageData(x, y, 1, 1);
    const data = pixel.data;

    picked_color.style.background = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255 })`;
    r_picker.value = data[0];
    g_picker.value = data[1];
    b_picker.value = data[2];
  }
}

function pick_drop() {
  picked_color.style.background = `rgb(${r_picked}, ${g_picked}, ${b_picked})`;
  r_picker.value = r_picked;
  g_picker.value = g_picked;
  b_picker.value = b_picked;
}

function pick_color(event) {
  if (isPicking) {
    const rect = canvas_img.getBoundingClientRect();
    let x = event.clientX - rect.left,
        y = event.clientY - rect.top;

    const pixel = context_img.getImageData(x, y, 1, 1);
    const data = pixel.data;

    picked_color.style.background = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255 })`;
    r_picked = data[0];
    g_picked = data[1];
    b_picked = data[2];
    
    isPicking = false;
  }
}

