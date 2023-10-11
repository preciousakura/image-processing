class image {
  constructor(array_pixels, _width, _height) {
    this.width = _width;
    this.height = _height;
    this.matrix = [];
    for (let i = 0, c = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++, c += 4)
        row.push(
          new pixel(
            array_pixels[c] / 255.0,
            array_pixels[c + 1] / 255.0,
            array_pixels[c + 2] / 255.0,
            array_pixels[c + 3] / 255.0
          )
        );
      this.matrix.push(row);
    }
  }

  pixelInImage(i, j) {
    return i >= 0 && i < this.height && j >= 0 && j < this.width;
  }

  chromaKey(bgImage, px, distance) {
    const image_matrix = bgImage.matrix;
    const bg_height = Math.floor(bgImage.height);

    let bg_i = 0, bg_j = 0;
    for (let i = 0; i < this.height; i++) {
      bg_j = 0;
      if(bg_i > bg_height - 1) bg_i = 0;
      for (let j = 0; j < this.width; j++) {
        const current_pixel = this.matrix[i][j];
        if (current_pixel.distance(px) <= distance) this.matrix[i][j] = image_matrix[bg_i][bg_j];
        bg_j++;
      } bg_i++;
    }
  }

  intensityTransform(T) {
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++)
        this.matrix[i][j] = T(this.matrix[i][j]);
  }

  applyKernelPixel(k, ki, kj, i, j){
    let n = k.length; //kernel dimension is n x n
    let i_min = i - ki,
      i_max = i + n - ki - 1;
    let j_min = j - kj,
      j_max = j + n - kj - 1;
    let px = new pixel(0.0, 0.0, 0.0, 1.0),
      zero = new pixel(0.0, 0.0, 0.0, 0.0);
    for (let x = i_min, i = 0; x <= i_max; i++, x++)
      for (let y = j_min, j = 0; y <= j_max; j++, y++) {
        let pxImage = this.pixelInImage(x, y) ? this.matrix[x][y] : zero;
        px = px.addPixel(pxImage.multScalar(k[i][j]));
      }
    return px;
  }

  applyKernel(k, ki, kj) {
    let newImage = [];
    for (let i = 0; i < this.height; i++) {
      let pxs = [];
      for (let j = 0; j < this.width; j++)
        pxs.push(this.applyKernelPixel(k, ki, kj, i, j));
      newImage.push(pxs);
    }
    this.matrix = newImage;
  }

  getMedianKernel(n, ki, kj, i, j) {
    let i_min = i - ki,
      i_max = i + n - ki - 1;
    let j_min = j - kj,
      j_max = j + n - kj - 1;
    let pxs = [];
    for (let x = i_min; x <= i_max; x++)
      for (let y = j_min; y <= j_max; y++)
        if (this.pixelInImage(x, y)) pxs.push(this.matrix[x][y]);
    pxs.sort((a, b) => a.r + a.g + a.b - (b.r + b.g + b.b));
    return pxs[Math.floor(pxs.length / 2.0)];
  }

  medianFilter(dimension, ki, kj) {
    let newImage = [];
    for (let i = 0; i < this.height; i++) {
      let pxs = [];
      for (let j = 0; j < this.width; j++)
        pxs.push(this.getMedianKernel(dimension, ki, kj, i, j));
      newImage.push(pxs);
    }
    this.matrix = newImage;
  }

  //isMax = true return max
  //isMax = false rturn min
  maxMinIntensity(isMax) {
    let m = isMax ? Number.MIN_VALUE : Number.MAX_VALUE;
    let func = isMax ? Math.max : Math.min;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        m = func(m, this.matrix[i][j].r);
        m = func(m, this.matrix[i][j].g);
        m = func(m, this.matrix[i][j].b);
      }
    }
    return m;
  }

  toArrayRGBA() {
    let buffer = [];
    let min = Math.abs(this.maxMinIntensity(false));
    let max = this.maxMinIntensity(true) + min;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        buffer.push(Math.round(this.matrix[i][j].r * 255));
        buffer.push(Math.round(this.matrix[i][j].g * 255));
        buffer.push(Math.round(this.matrix[i][j].b * 255));
        buffer.push(Math.round(this.matrix[i][j].a * 255));
      }
    }
    return buffer;
  }

  erase(x, y, dimension, k) {
    const startX = x - Math.round(dimension/2);
    const startY = y - Math.round(dimension/2);
    for (let i = startY, x = 0; i < startY + dimension; i++, x++) {
      for (let j = startX, y = 0; j < startX + dimension; j++, y++) {
        if(!this.pixelInImage(i, j)) continue;
        this.matrix[i][j] = this.matrix[i][j].multScalar(k[x][y]);
      }
    }
  }

  copyImage() {
    return new image(this.toArrayRGBA(), this.width, this.height);
  }

  normalize() {
    let mmin = Math.abs(this.maxMinIntensity(false));
    let mmax = this.maxMinIntensity(true) + mmin;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.matrix[i][j].r = (this.matrix[i][j].r + mmin) / mmax;
        this.matrix[i][j].g = (this.matrix[i][j].g + mmin) / mmax;
        this.matrix[i][j].b = (this.matrix[i][j].b + mmin) / mmax;
        this.matrix[i][j].a = 1.0;
      }
    }
  }

  scale(swidth, sheight, interpolation) {
    let array_pixels = [];
    let width = Math.round(this.width * swidth),
      height = Math.round(this.height * sheight);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let x = i / sheight,
          y = j / swidth;
        let px = interpolation(x, y, this);
        array_pixels.push(Math.round(px.r * 255));
        array_pixels.push(Math.round(px.g * 255));
        array_pixels.push(Math.round(px.b * 255));
        array_pixels.push(Math.round(px.a * 255));
      }
    }
    return new image(array_pixels, width, height);
  }

  scaleNone(swidth, sheight) {
    return this.scale(swidth, sheight, nearest_neighborhood);
  }

  scaleLinear(swidth, sheight) {
    return this.scale(swidth, sheight, bilinear_interpolation);
  }

  rotate(x, y, angle) {
    return [
      x * Math.cos(angle) - y * Math.sin(angle),
      y * Math.cos(angle) + x * Math.sin(angle),
    ];
  }

  rotation(angle, interpolation) {
    angle = (Math.PI * angle) / 180;
    let x, y;
    let mminx = Number.POSITIVE_INFINITY,
      mmaxx = Number.NEGATIVE_INFINITY;
    let mminy = Number.POSITIVE_INFINITY,
      mmaxy = Number.NEGATIVE_INFINITY;
    [x, y] = this.rotate(0, 0, angle);
    mminx = Math.min(mminx, x);
    mmaxx = Math.max(mmaxx, x);
    mminy = Math.min(mminy, y);
    mmaxy = Math.max(mmaxy, y);
    [x, y] = this.rotate(0, this.width - 1, angle);
    mminx = Math.min(mminx, x);
    mmaxx = Math.max(mmaxx, x);
    mminy = Math.min(mminy, y);
    mmaxy = Math.max(mmaxy, y);
    [x, y] = this.rotate(this.height - 1, 0, angle);
    mminx = Math.min(mminx, x);
    mmaxx = Math.max(mmaxx, x);
    mminy = Math.min(mminy, y);
    mmaxy = Math.max(mmaxy, y);
    [x, y] = this.rotate(this.height - 1, this.width - 1, angle);
    mminx = Math.min(mminx, x);
    mmaxx = Math.max(mmaxx, x);
    mminy = Math.min(mminy, y);
    mmaxy = Math.max(mmaxy, y);

    angle = 2 * Math.PI - angle;
    let array_pixels = [];
    let width = Math.round(mmaxy - mminy),
      height = Math.round(mmaxx - mminx);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        [x, y] = this.rotate(i + mminx, j + mminy, angle);
        let px = interpolation(x, y, this);
        array_pixels.push(Math.round(px.r * 255));
        array_pixels.push(Math.round(px.g * 255));
        array_pixels.push(Math.round(px.b * 255));
        array_pixels.push(Math.round(px.a * 255));
      }
    }
    return new image(array_pixels, width, height);
  }

  rotationNone(angle) {
    return this.rotation(angle, nearest_neighborhood);
  }

  rotationLinear(angle) {
    return this.rotation(angle, bilinear_interpolation);
  }
}

function copyImage(img) {
  return new image(img.toArrayRGBA(), img.width, img.height);
}

function binOperationIMG(img1, img2, op) {
  if (img1.width != img2.width || img1.height != img2.height) {
    alert("img1 and img2 must have the same dimension to do a bin operation");
    return;
  }
  let aux = img1.copyImage();
  for (let i = 0; i < aux.height; i++)
    for (let j = 0; j < aux.width; j++)
      aux.matrix[i][j] = binOperationPX(
        img1.matrix[i][j],
        img2.matrix[i][j],
        op
      );
  return aux;
}
