function gamma(c) {
  if(image) {
    image.gammaTransform(c);
    drawHistogram();
  }
}

function log(c) {
  if(image) {
    image.logTransform(c);
    drawHistogram();
  }
}

function negative(value) {
  if(image) {
    image.negative(value);
    drawHistogram();
  }
}

function toGray(value) {
  if(image) {
    image.toGray(value);
    drawHistogram();
  }
}
