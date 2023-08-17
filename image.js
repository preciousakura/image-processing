class ImageCanva {
  constructor(width, height, pixels, ctx) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.pixels = pixels;

    this.data = [...this.pixels.data];

    // tranform pixels to [0, 1]
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = this.data[i] / 255.0;
      this.data[i + 1] = this.data[i + 1] / 255.0;
      this.data[i + 2] = this.data[i + 2] / 255.0;
    }
  }

  // transform pixels to [0, 255]
  updatePixel() {
    const pixelsData = this.pixels;

    for (let i = 0; i < pixelsData.data.length; i += 4) {
      pixelsData.data[i] = this.data[i] * 255;
      pixelsData.data[i + 1] = this.data[i + 1] * 255;
      pixelsData.data[i + 2] = this.data[i + 2] * 255;
    }

    this.ctx.putImageData(this.pixels, 0, 0, 0, 0, this.width, this.height);
  }

  toGray() {
    for (let i = 0; i < this.data.length; i += 4) {
      const avg = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
      this.data[i] = avg;
      this.data[i + 1] = avg;
      this.data[i + 2] = avg;
    }

    this.updatePixel();
  }

  invert() {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = 1 - this.data[i];
      this.data[i + 1] = 1 - this.data[i + 1];
      this.data[i + 2] = 1 - this.data[i + 2];
    }

    this.updatePixel();
  }

  logTransform() {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = Math.log(1 + this.data[i]);
      this.data[i + 1] = Math.log(1 + this.data[i + 1]);
      this.data[i + 2] = Math.log(1 + this.data[i + 2]);
    }
    this.updatePixel();
  }
}
