const cGamma = document.getElementById("cGamma");
const expGamma = document.getElementById("expGamma");
cGamma.addEventListener("change", () => {
  if (orchestrator)
    orchestrator.intensityTransform(gamma(cGamma.value, expGamma.value));
});
expGamma.addEventListener("change", () => {
  if (orchestrator)
    orchestrator.intensityTransform(gamma(cGamma.value, expGamma.value));
});

const cLog = document.getElementById("cLog");
cLog.addEventListener("change", () => {
  if (orchestrator) orchestrator.intensityTransform(log2(cLog.value));
});

const tresholdValue = document.getElementById("tresholdValue");
tresholdValue.addEventListener("change", () => {
  if (orchestrator) {
    let t = tresholdValue.value;
    orchestrator.intensityTransform(treshold(t));
  }
});

function encrypt() {
  const text = document.getElementById("steganographyText").value;
  if (orchestrator)
    orchestrator.steganographyEncrypt(text);
  closeSubmenu();
  closePopup();
}

function decrypt() {
  if (orchestrator) {
    document.getElementById("steMessage").innerHTML =
      orchestrator.steganographyDecrypt();
    openPopup("decryptPopup");
  }
  closeSubmenu();
}

const r_sepia = document.getElementById("r_sepia");
const g_sepia = document.getElementById("g_sepia");
r_sepia.addEventListener("change", sepia_action);
g_sepia.addEventListener("change", sepia_action);
function sepia_action() {
  if (orchestrator)
    orchestrator.intensityTransform(
      multiply(r_sepia.value, g_sepia.value, 1.0)
    );
}

function sepia() {
  if (orchestrator) {
    orchestrator.intensityTransform(toGrayW, true);
    openPopup("sepiaPopup");
  }
}

function genericTransform(transform) {
  if (orchestrator) orchestrator.intensityTransform(transform, true);
  closeSubmenu();
}

function histogramEq() {
  if (orchestrator) {
    orchestrator.histogramEqualization(0);
    orchestrator.histogramEqualization(1);
    orchestrator.histogramEqualization(2);
    orchestrator.do();
  }
  closeSubmenu();
}

function histogramHSIEq() {
  if (orchestrator) {
    orchestrator.histogramEqualization(3);
    orchestrator.do();
  }
  closeSubmenu();
}

function normalize() {
  if (orchestrator) {
    let divisor = orchestrator.getBiggestIntensity();
    orchestrator.intensityTransform(normalize(divisor), true);
  }
  closeSubmenu();
}

const dimensionGauss = document.getElementById("dimensionGauss");
const sigmaGauss = document.getElementById("sigmaGauss");
function gaussian() {
  if (orchestrator) {
    let n = parseInt(dimensionGauss.value);
    let sigma = parseFloat(sigmaGauss.value);
    let mid = Math.floor(n / 2.0);
    orchestrator.applyKernel(gaussianKernel(n, sigma), mid, mid, true);
  }
  closePopup();
}

const dimensionMean = document.getElementById("dimensionMean");
function mean() {
  if (orchestrator) {
    let n = parseInt(dimensionMean.value);
    let mid = Math.floor(n / 2.0);
    orchestrator.applyKernel(meanKernel(n), mid, mid, true);
  }
  closePopup();
}

const dimensionMedian = document.getElementById("dimensionMedian");
function median() {
  if (orchestrator) {
    let n = parseInt(dimensionMedian.value);
    let mid = Math.floor(n / 2.0);
    orchestrator.medianFilter(n, mid, mid, true);
  }
  closePopup();
}

const kernelText = document.getElementById("kernelText");
function kernel_free() {
  if (orchestrator) {
    let kernel = JSON.parse(kernelText.value);
    let n = parseInt(kernel.length);
    let mid = Math.floor(n / 2.0);
    orchestrator.applyKernel(kernel, mid, mid, true);
  }
  closePopup();
}

function applyLaplacian() {
  if (orchestrator) {
    let n = 3;
    let mid = Math.floor(n / 2.0);
    orchestrator.applyKernel(laplacianKernel(), mid, mid, true);
    closeSubmenu();
  }
}

function applyHighBoost() {
  if (orchestrator) {
    let n = document.getElementById("dimensionHigh").value;
    let sigma = document.getElementById("sigmaHigh").value;
    let k = document.getElementById("kHigh").value;
    let mid = Math.floor(n / 2.0);
    let img = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgBlur = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    imgBlur.applyKernel(gaussianKernel(n, sigma), mid, mid);
    let imgMask = binOperationIMG(img, imgBlur, (a, b) => a - b);
    imgMask.intensityTransform(unaryOperationPX((x) => k * x));
    let highboosted = binOperationIMG(img, imgMask, (a, b) => a + b);
    orchestrator.addImage(highboosted);
    closePopup();
  }
}

function applySobel() {
  if (orchestrator) {
    let n = 3;
    let mid = Math.floor(n / 2.0);
    let imgA = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgB = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    imgA.applyKernel(sobelXKernel(), mid, mid);
    imgB.applyKernel(sobelYKernel(), mid, mid);
    imgA.intensityTransform(unaryOperationPX((x) => x * x));
    imgB.intensityTransform(unaryOperationPX((x) => x * x));
    let imgC = binOperationIMG(imgA, imgB, sum);
    imgC.intensityTransform(unaryOperationPX((x) => Math.sqrt(x)));
    orchestrator.addImage(imgC);
    closeSubmenu();
  }
}

const scaleWN = document.getElementById("scaleWN");
const scaleHN = document.getElementById("scaleHN");
function scale_none() {
  if (orchestrator) {
    let imgAux = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgScaled = imgAux.scaleNone(scaleWN.value, scaleHN.value);
    orchestrator.addImage(imgScaled);
    closePopup();
  }
}

const scaleWL = document.getElementById("scaleWL");
const scaleHL = document.getElementById("scaleHL");
function scale_linear() {
  if (orchestrator) {
    let imgAux = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgScaled = imgAux.scaleLinear(scaleWL.value, scaleHL.value);
    orchestrator.addImage(imgScaled);
  }
  closePopup();
}

const angleN = document.getElementById("angleN");
function rotation_none() {
  if (orchestrator) {
    let imgAux = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgRotated = imgAux.rotationLinear(angleN.value);
    orchestrator.addImage(imgRotated);
  }
  closePopup();
}

const angleL = document.getElementById("angleL");
function rotation_linear() {
  if (orchestrator) {
    let imgAux = copyImage(
      orchestrator.imageHistory[orchestrator.imageHistory.length - 1]
    );
    let imgRotated = imgAux.rotationLinear(angleL.value);
    orchestrator.addImage(imgRotated);
  }
  closePopup();
}

const cFFT = document.getElementById("cFFT");
const expFFT = document.getElementById("expFFT");
cFFT.addEventListener("change", changeImageFFT);
expFFT.addEventListener("change", changeImageFFT);
function changeImageFFT() {
  erased_image_data.intensityTransform(gamma(cFFT.value, expFFT.value));
}

const transform_r = document.getElementById("transform_r");
const transform_g = document.getElementById("transform_g");
const transform_b = document.getElementById("transform_b");

const transform_h = document.getElementById("transform_h");
const transform_s = document.getElementById("transform_s");
const transform_v = document.getElementById("transform_v");

const transform_color = document.getElementById("transform-color");

transform_r.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = rgbToHSV(
    color,
    transform_g.value,
    transform_b.value
  );

  transform_h.value = transformedColor[0];
  transform_s.value = transformedColor[1];
  transform_v.value = transformedColor[2];

  transform_color.style.background = `rgb(${color}, ${transform_g.value}, ${transform_b.value})`;
});
transform_g.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = rgbToHSV(
    transform_r.value,
    color,
    transform_b.value
  );

  transform_h.value = transformedColor[0];
  transform_s.value = transformedColor[1];
  transform_v.value = transformedColor[2];

  transform_color.style.background = `rgb(${transform_r.value}, ${color}, ${transform_b.value})`;
});
transform_b.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = rgbToHSV(
    transform_r.value,
    transform_g.value,
    color
  );

  transform_h.value = transformedColor[0];
  transform_s.value = transformedColor[1];
  transform_v.value = transformedColor[2];

  transform_color.style.background = `rgb(${transform_r.value}, ${transform_g.value}, ${color})`;
});

transform_h.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = hsvToRGB(
    color,
    transform_s.value,
    transform_v.value
  );

  transform_r.value = transformedColor[0];
  transform_g.value = transformedColor[1];
  transform_b.value = transformedColor[2];

  transform_color.style.background = `rgb(${transform_r.value}, ${transform_g.value}, ${transform_b.value})`;
});
transform_s.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = hsvToRGB(
    transform_h.value,
    color,
    transform_v.value
  );

  transform_r.value = transformedColor[0];
  transform_g.value = transformedColor[1];
  transform_b.value = transformedColor[2];

  transform_color.style.background = `rgb(${transform_r.value}, ${transform_g.value}, ${transform_b.value})`;
});
transform_v.addEventListener("change", (e) => {
  const color = e.target.value;
  const transformedColor = hsvToRGB(
    transform_h.value,
    transform_s.value,
    color
  );

  transform_r.value = transformedColor[0];
  transform_g.value = transformedColor[1];
  transform_b.value = transformedColor[2];

  transform_color.style.background = `rgb(${transform_r.value}, ${transform_g.value}, ${transform_b.value})`;
});

const hsl_h = document.getElementById("hsl_h");
const hsl_s = document.getElementById("hsl_s");
const hsl_l = document.getElementById("hsl_l");
const transform_hsl = document.getElementById("hsl-color");

hsl_h.addEventListener("change", (_) => {
  const h = hsl_h.value;
  const s = hsl_s.value / 100;
  const l = hsl_l.value / 100;

  const color = hsiToRGB(h, s, l);
  transform_hsl.style.background = `rgb(${color[0] * 255}, ${color[1] * 255}, ${
    color[2] * 255
  })`;

  orchestrator.intensityTransform(transformHsl(h, s, l));
});

hsl_s.addEventListener("change", (_) => {
  const h = hsl_h.value;
  const s = hsl_s.value / 100;
  const l = hsl_l.value / 100;

  const color = hsiToRGB(h, s, l);
  transform_hsl.style.background = `rgb(${color[0] * 255}, ${color[1] * 255}, ${
    color[2] * 255
  })`;

  orchestrator.intensityTransform(transformHsl(h, s, l));
});

hsl_l.addEventListener("change", (_) => {
  const h = hsl_h.value;
  const s = hsl_s.value / 100;
  const l = hsl_l.value / 100;

  const color = hsiToRGB(h, s, l);
  transform_hsl.style.background = `rgb(${color[0] * 255}, ${color[1] * 255}, ${
    color[2] * 255
  })`;

  orchestrator.intensityTransform(transformHsl(h, s, l));
});

const rgb_r = document.getElementById("rgb_r");
const rgb_g = document.getElementById("rgb_g");
const rgb_b = document.getElementById("rgb_b");
const transform_rgb = document.getElementById("rgb-color");

rgb_r.addEventListener("change", (_) => {
  const r = rgb_r.value;
  const g = rgb_g.value;
  const b = rgb_b.value;

  transform_rgb.style.background = `rgb(${r}, ${g}, ${b})`;

  orchestrator.intensityTransform(transformRGB(r, g, b));
});

rgb_g.addEventListener("change", (_) => {
  const r = rgb_r.value;
  const g = rgb_g.value;
  const b = rgb_b.value;

  transform_rgb.style.background = `rgb(${r}, ${g}, ${b})`;

  orchestrator.intensityTransform(transformRGB(r, g, b));
});

rgb_b.addEventListener("change", (_) => {
  const r = rgb_r.value;
  const g = rgb_g.value;
  const b = rgb_b.value;

  transform_rgb.style.background = `rgb(${r}, ${g}, ${b})`;

  orchestrator.intensityTransform(transformRGB(r, g, b));
});
