var image;
const canvasImage = document.getElementById("image");
const contextImage = canvasImage.getContext('2d', { willReadFrequently: true });

const loadImage = function (event) {
  const img = new Image();

  img.onload = function () {
    URL.revokeObjectURL(img.src);
  };

  img.src = URL.createObjectURL(event.target.files[0]);
  img.addEventListener("load", () => {
    const width = img.width > 400 ? 400 : img.width;
    const height = (width / img.width) * img.height;

    (canvasImage.width = width), (canvasImage.height = height);

    contextImage.drawImage(img, 0, 0, width, height);
    const data_image = contextImage.getImageData(0, 0, width, height);
    image = new ImageCanva(width, height, data_image, contextImage);
    image.processHistogram();
    drawHistogram();
    img.style.display = "none";
  });
};
