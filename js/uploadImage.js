const loadImage = function (event) {
  if(event.target.files.length > 0) {
    const img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(img.src);
    };
  
    img.src = URL.createObjectURL(event.target.files[0]);
    img.addEventListener("load", () => {
      const width = img.width > 400 ? 400 : img.width;
      const height = (width / img.width) * img.height;
  
      (canvas_img.width = width), (canvas_img.height = height);
  
      context_img.drawImage(img, 0, 0, width, height);
      const data_image = context_img.getImageData(0, 0, width, height);
      image = new ImageCanva(width, height, data_image, context_img);
      image.processHistogram();
      drawHistogram();
      img.style.display = "none";
    });
  }
};

const saveImage = () => {
  if(image) {
    const link = document.getElementById("save");
    link.setAttribute("download", "result.png");
    link.setAttribute('href', canvas_img.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }
}
