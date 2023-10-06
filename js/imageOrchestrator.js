class imageOrchestrator {
  constructor(_img, _context, _canvas, _hasHistogram = true) {
    this.colorBuffer = _img;
    this.imgTemp = new image(this.colorBuffer.data, _img.width, _img.height);
    this.imageHistory = [
      new image(this.colorBuffer.data, _img.width, _img.height),
    ];
    this.lastImage = this.imageHistory[this.imageHistory.length - 1];
    this.context = _context;
    this.canvas = _canvas;
    this.hasHistogram = _hasHistogram;
    this.showChanges();
  }

  addImage(img) {
    this.imageHistory.push(img);
    this.recoverLastImage();
    this.showChanges();
  }

  recoverLastImage() {
    this.lastImage = this.imageHistory[this.imageHistory.length - 1];
    let lastBuffer = this.lastImage.toArrayRGBA();

    this.colorBuffer = new ImageData(this.lastImage.width, this.lastImage.height);

    for (let i = 0; i < this.colorBuffer.data.length; i++)
      this.colorBuffer.data[i] = lastBuffer[i];
    this.imgTemp = new image(lastBuffer, this.lastImage.width, this.lastImage.height);
  }

  intensityTransform(T, apply = false) {
    this.recoverLastImage();
    this.imgTemp.intensityTransform(T);
    const arrayImage = this.imgTemp.toArrayRGBA();
    for (let i = 0; i < this.colorBuffer.data.length; i++)
      this.colorBuffer.data[i] = arrayImage[i];
    this.showChanges();
    if (apply) this.do();
  }

  applyKernel(k, ki, kj, apply = false) {
    this.recoverLastImage();
    this.imgTemp.applyKernel(k, ki, kj);
    const arrayImage = this.imgTemp.toArrayRGBA();
    for (let i = 0; i < this.colorBuffer.data.length; i++)
      this.colorBuffer.data[i] = arrayImage[i];
    this.showChanges();
    if (apply) this.do();
  }

  medianFilter(dimension, ki, kj, apply = false) {
    this.recoverLastImage();
    this.imgTemp.medianFilter(dimension, ki, kj);
    const arrayImage = this.imgTemp.toArrayRGBA();
    for (let i = 0; i < this.colorBuffer.data.length; i++)
      this.colorBuffer.data[i] = arrayImage[i];
    this.showChanges();
    if (apply) this.do();
  }

  do() {
    this.imageHistory.push(
      new image(this.colorBuffer.data, this.lastImage.width, this.lastImage.height)
    );
    this.showChanges();
  }

  undo() {
    if (this.imageHistory.length >= 2) {
      this.imageHistory.pop();
      this.recoverLastImage();
      this.showChanges();
    }
  }

  showChanges() {
    this.canvas.width = this.lastImage.width;
    this.canvas.height = this.lastImage.height;
    
    this.context.putImageData(this.colorBuffer, 0, 0, 0, 0, this.lastImage.width, this.lastImage.height);
    if(this.hasHistogram) drawHistogram(this.intensityHistogram());
  }

  showNormalized() {
    let lastImage = this.imageHistory[this.imageHistory.length - 1];
    let lastBuffer = lastImage.toArrayRGBA();
    let mmin = Number.MAX_VALUE,
      mmax = Number.MIN_VALUE;
    for (let i = 0; i < lastBuffer.length; i++) lastBuffer[i] /= 255.0;
    for (let i = 0; i < lastBuffer.length; i++) {
      if (i % 4 == 3) continue;
      mmin = Math.min(mmin, lastBuffer[i]);
      mmax = Math.max(mmax, lastBuffer[i]);
    }
    mmax += mmin;
    for (let i = 0; i < lastBuffer.length; i++) {
      if (i % 4 == 3) continue;
      lastBuffer[i] = (lastBuffer[i] + mmin) / mmax;
    }
    for (let i = 0; i < lastBuffer.length; i++)
      this.colorBuffer.data[i] = Math.ceil(lastBuffer[i] * 255.0);
    this.showChanges();
  }

  showNotNormalized() {
    this.recoverLastImage();
    this.showChanges();
  }

  getBiggestIntensity() {
    let maxIntensity = 0.0;
    for (let i = 0; i < this.lastImage.height; i++)
      for (let j = 0; j < this.lastImage.width; j++)
        maxIntensity = Math.max(maxIntensity, this.imgTemp.matrix[i][j].max());
    return maxIntensity;
  }
  // r = 0, b = 1, g = 2
  intensityHistogram(comp=0) {
    let histogram = new Array(256).fill(0);
    for (let i = 0; i < this.colorBuffer.data.length; i += 4) 
      ++histogram[this.colorBuffer.data[i+comp]];
    return histogram;
  }

  intensityProbabilities() {
    let probabilities = this.intensityHistogram();
    for (let i = 0; i < 256; i++) probabilities[i] /= this.lastImage.width * this.lastImage.height;
    return probabilities;
  }

  histogramEqualizationMap() {
    let map = new Array(256).fill(0);
    let prefixSumProbabilities = this.intensityProbabilities();
    for (let i = 1; i < 256; i++)
      prefixSumProbabilities[i] += prefixSumProbabilities[i - 1];
    for (let i = 0; i < 256; i++)
      map[i] = Math.round(prefixSumProbabilities[i] * 255.0);
    return map;
  }

  histogramEqualization() {
    let map = this.histogramEqualizationMap();
    for (let i = 0; i < this.colorBuffer.data.length; i++) {
      if (i % 4 == 3) continue;
      this.colorBuffer.data[i] = map[this.colorBuffer.data[i]];
    }
    this.do();
  }

  steganographyEncrypt(text) {
    let fullMask = (1 << 8) - 1; //255
    let binaryText = "";
    for (let i = 0; i < text.length; i++) {
      let mask = text[i].charCodeAt(0);
      for (let bit = 0; bit < 8; bit++)
        binaryText += mask & (1 << bit) ? "1" : "0";
    }
    for (let i = 0; i < this.colorBuffer.data.length; i++) {
      let bit = i < binaryText.length ? binaryText[i] == "1" : false;
      this.colorBuffer.data[i] &= fullMask ^ (1 - bit);
      this.colorBuffer.data[i] |= bit;
    }
    this.do();
  }

  steganographyDecrypt() {
    let encryptedText = "";
    for (let i = 0; i < this.colorBuffer.data.length; i += 8) {
      let mask = 0;
      for (let j = 0; j < 8; j++) {
        let bit = this.colorBuffer.data[i + j] & 1 ? 1 : 0;
        mask |= bit << j;
      }
      if (mask == 0) break;
      encryptedText += String.fromCharCode(mask);
    }
    return encryptedText;
  }

  erase(x, y, radius, color) {
    this.imgTemp.erase(x, y, radius, color);
    const arrayImage = this.imgTemp.toArrayRGBA();
    for (let i = 0; i < this.colorBuffer.data.length; i++)
      this.colorBuffer.data[i] = arrayImage[i];
    this.do();
  }
}
