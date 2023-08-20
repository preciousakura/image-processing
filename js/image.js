class ImageCanva {
  constructor(width, height, pixels, ctx) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.histogram = new Array(256).fill(0);
    this.maxBrightness = 0;
    this.data = [...this.pixels.data];

    // tranform pixels to [0, 1]
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = this.data[i] / 255.0;
      this.data[i + 1] = this.data[i + 1] / 255.0;
      this.data[i + 2] = this.data[i + 2] / 255.0;
    }
  }

  processHistogram() {
    this.histogram = new Array(256).fill(0);
    const pixel = new Uint32Array(this.pixels.data.buffer);

    for (let i = 0; i < pixel.length; i++) {
      const r = pixel[i] & 0xff;
      const g = (pixel[i] >> 8) & 0xff;
      const b = (pixel[i] >> 16) & 0xff;

      this.histogram[r]++;
      this.histogram[g]++;
      this.histogram[b]++;
    }

    let max = 0;
    for (let i = 1; i < 256; i++) {
      if (max < this.histogram[i]) max = this.histogram[i];
    }

    this.maxBrightness = max;
  }

  // transform pixels to [0, 255]
  updatePixel(tranformFunction) {
    const pixelsData = this.pixels;

    for (let i = 0; i < pixelsData.data.length; i += 4) {
      const result = tranformFunction(this.data[i], this.data[i + 1], this.data[i + 2]);
      pixelsData.data[i] = result[0] * 255;
      pixelsData.data[i + 1] = result[1] * 255;
      pixelsData.data[i + 2] = result[2] * 255;
    }

    this.ctx.putImageData(this.pixels, 0, 0, 0, 0, this.width, this.height);
    this.processHistogram();
  }

  toGray() {
    this.updatePixel((r, g, b) => {
      const avg = (r + g + b) / 3;
      return [avg, avg, avg];
    });
  }

  negative() {
    this.updatePixel((r, g, b) => {
      return [1 - r, 1 - g, 1 - b];
    });
  }

  logTransform(c) {
    this.updatePixel((r, g, b) => {
      return [c * Math.log2(1 + r), c * Math.log2(1 + g), c * Math.log2(1 + b)];
    });
  }

  gamaCorrection(c) {
    this.updatePixel((r, g, b) => {
      return [Math.pow(r, c), Math.pow(g, c), Math.pow(b, c)];
    });
  }
}
