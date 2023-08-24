class ImageCanva {
  constructor(width, height, pixels, context) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.context = context;
    this.originImage = [...pixels.data];
    
    this.data = [...pixels.data];
    this.histogram = new Array(256).fill(0);
    this.maxBrightness = 0;
    
    this.transform = { gamma: undefined, log: undefined, grayscale: undefined, negative: undefined, function: undefined }
    this.transformations = Object.keys(this.transform)
  }
  
  updatePixel() {
    const changedData = [...this.data];
    const { data } = this.pixels;
    
    for (let i = 0; i < changedData.length; i += 4) {
      for(let j = 0; j < this.transformations.length; j++) {
        const transform = this.transform[this.transformations[j]];
        if(transform) {
          const result = transform(changedData[i], changedData[i + 1], changedData[i + 2]);
          changedData[i] = result[0];
          changedData[i + 1] = result[1];
          changedData[i + 2] = result[2];
        } 
        data[i] = changedData[i]
        data[i + 1] = changedData[i + 1]
        data[i + 2] = changedData[i + 2]
      }
    }
    
    this.context.putImageData(this.pixels, 0, 0, 0, 0, this.width, this.height);
    this.processHistogram();
  }
  
  undo() {
    this.data = this.originImage;
    this.transform = { gamma: undefined, log: undefined, grayscale: undefined, negative: undefined, function: undefined }
    this.updatePixel()
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
    for (let i = 1; i < 256; i++) 
      if (max < this.histogram[i]) max = this.histogram[i];
    

    this.maxBrightness = max;
  }

  toGray(value) {
    if(value)
      this.transform = {
        ...this.transform, 
        grayscale: (r, g, b) => {
          const avg = (r + g + b) / 3;
          return [avg, avg, avg];
        }
      }
    else 
      this.transform = {
        ...this.transform, 
        grayscale: undefined
      }
    this.updatePixel();
  }

  negative(value) {
    if(value)
      this.transform = {
        ...this.transform, 
        negative: (r, g, b) => {
          return [255 - r, 255 - g, 255 - b];
        }
      }
    else 
      this.transform = {
        ...this.transform, 
        negative: undefined
      }
    this.updatePixel();
  }

  logTransform(c) {
    this.transform = {
      ...this.transform,
      log: (r, g, b) => {
        return [c * Math.log2(1 + r), c * Math.log2(1 + g), c * Math.log2(1 + b)];
      }
    }
    this.updatePixel();
  }

  gammaTransform(c) {
    this.transform = {
      ...this.transform, 
      gamma: (r, g, b) => {
        return [Math.pow(r, c), Math.pow(g, c), Math.pow(b, c)];
      }
    }
    this.updatePixel();
  }

  piecewiseLinear(begin, final, canvasw, canvash) {
    const begin_point = begin ? {x: Math.abs((begin[0] * (255/canvasw))), y: (Math.abs(begin[1] - canvash) * (255/canvash))} : undefined
    const final_point = final ? {x: Math.abs((final[0] * (255/canvasw))), y: (Math.abs(final[1] - canvash) * (255/canvash))} : undefined
    
    const a_i = begin_point.y / begin_point.x;
    const b_i = 0;
    
    if (final_point) {
      const a_m = (final_point.y - begin_point.y) / (final_point.x - begin_point.x);
      const b_m = begin_point.y - a_m * begin_point.x;

      const a_f = (255 - final_point.y) / (255 - final_point.x);
      const b_f = final_point.y - a_f * final_point.x;

      this.transform = {
        ...this.transform,
        function: (r, g, b) => {
          if (r < begin_point.x) r = a_i * r + b_i;
          else if (r >= begin_point.x && r <= final_point.x) r = a_m * r + b_m;
          else r = a_f * r + b_f;
  
          if (g < begin_point.x) g = a_i * g + b_i;
          else if (g >= begin_point.x && g <= final_point.x) g = a_m * g + b_m;
          else g = a_f * g + b_f;
  
          if (b < begin_point.x) b = a_i * b + b_i;
          else if (b >= begin_point.x && b <= final_point.x) b = a_m * b + b_m;
          else b = a_f * b + b_f;
  
          return [r, g, b];
        }
      }
    } else {    
      const a_f = (255 - begin_point.y) / (255 - begin_point.x);
      const b_f = begin_point.y - a_f * begin_point.x;;
    
      this.transform = {
        ...this.transform,
        function: (r, g, b) => {
          if (r <= begin_point.x) r = a_i * r + b_i;
          else r = a_f * r + b_f;
  
          if (g <= begin_point.x) g = a_i * g + b_i;
          else g = a_f * g + b_f;
  
          if (b <= begin_point.x) b = a_i * b + b_i;
          else b = a_f * b + b_f;
  
          return [r, g, b];
        }
      }
    }
    
    this.updatePixel();
  }
}
