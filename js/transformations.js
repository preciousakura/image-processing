function toGray(px) {
  let mean = (px.r + px.g + px.b) / 3.0;
  return new pixel(mean, mean, mean, 1.0);
}

function toGrayW(px) {
  let mean = px.r * 0.2989 + px.g * 0.587 + px.b * 0.114;
  return new pixel(mean, mean, mean, 1.0);
}

function negative(px) {
  return new pixel(1.0 - px.r, 1.0 - px.g, 1.0 - px.b, 1.0);
}

function gamma(c, exp) {
  return function (px) {
    return new pixel(
      c * Math.pow(px.r, exp),
      c * Math.pow(px.g, exp),
      c * Math.pow(px.b, exp),
      1.0
    );
  };
}

function log2(c) {
  return function (px) {
    return new pixel(
      c * Math.log2(1 + px.r),
      c * Math.log2(1 + px.g),
      c * Math.log2(1 + px.b),
      1.0
    );
  };
}

function normalize(divisor) {
  return function (px) {
    if (divisor == 0) return px;
    return new pixel(px.r / divisor, px.g / divisor, px.b / divisor, 1.0);
  };
}

function treshold(t) {
  t = t / 255.0;
  return function (px) {
    if (Math.min(px.r, px.g, px.b) < t) return new pixel(0.0, 0.0, 0.0, 1.0);
    return px;
  };
}

function multiply(rf, gf, bf) {
  return function (px) {
    return new pixel(px.r * rf, px.g * gf, px.b * bf, 1.0);
  };
}

function sum(a, b) {
  return a + b;
}
function minus(a, b) {
  return a - b;
}

function transformHsl(h, s, l) {
  return function (px) {
    const hsi_px = rgbToHSI(px.r, px.g, px.b);
    const rgb_px = hsiToRGB(hsi_px[0] + h, hsi_px[1] + s, hsi_px[2] + l);

    return new pixel(rgb_px[0], rgb_px[1], rgb_px[2], 1);
  };
}

function transformRGB(r, g, b) {
  return function (px) {
    return new pixel(px.r + r/255, px.g + g/255, px.b + b/255, 1);
  };
}
