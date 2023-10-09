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
  orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);
}
function onChangeG(value) {
  picked_color.style.background = `rgb(${r_picked}, ${value}, ${b_picked})`;
  g_picked = value;
  orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);
}
function onChangeB(value) {
  picked_color.style.background = `rgb(${r_picked}, ${g_picked}, ${value})`;
  b_picked = value;
  orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);
}

function onChangeDistance(value) {
  distance = value;
  orchestrator.recoverLastImage();
  orchestrator.showChanges();
  orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);
}

const loadChromaKeyImage = (event) => {
  if (orchestrator) {
    if (event.target.files.length > 0) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);

      img.addEventListener("load", () => {
        let width = img.width;
        let height = img.height;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        const data_image = context.getImageData(0, 0, width, height);
        image_chromaK = new image(data_image.data, width, height);
        
        const scale_x = canvas_img.width/width;
        const scale_y = canvas_img.height/height;
        image_chromaK = image_chromaK.scaleNone(scale_x, scale_y);
        
        openModal("pickerchromakey");
        orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);
        img.style.display = "none";

        canvas.remove();
      });
    }
  }
};

function chromaKeyApply() {
  orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance, true);
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
  orchestrator.recoverLastImage();
  orchestrator.showChanges();
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

    orchestrator.chromaKey(image_chromaK, r_picked, g_picked, b_picked, distance);

    isPicking = false;
  }
}

