const toGrayButton = document.getElementById("toGrayButton");
toGrayButton.addEventListener("click", () => {
  if(orchestrator)
    orchestrator.intensityTransform(toGray, true);
});

const toGrayButtonW = document.getElementById("toGrayButtonW");
toGrayButtonW.addEventListener("click", () => {
        if(orchestrator)
            orchestrator.intensityTransform(toGrayW, true);
});

const negativeButton = document.getElementById("negativeButton");
negativeButton.addEventListener("click", () => {
  if(orchestrator)
    orchestrator.intensityTransform(negative, true);
});

const cGamma = document.getElementById("cGamma");
const expGamma = document.getElementById("expGamma");
cGamma.addEventListener("change", () => {
  if(orchestrator)
    orchestrator.intensityTransform(gamma(cGamma.value, expGamma.value));
});
expGamma.addEventListener("change", () => {
  if(orchestrator)
    orchestrator.intensityTransform(gamma(cGamma.value, expGamma.value));
});

const cLog = document.getElementById("cLog");
cLog.addEventListener("change", () => {
  if(orchestrator)
    orchestrator.intensityTransform(log2(cLog.value));
});

const tresholdValue = document.getElementById("tresholdValue");
tresholdValue.addEventListener("change", () => {
  if(orchestrator){
    let t = tresholdValue.value;
    orchestrator.intensityTransform(treshold(t));
  }
});

const steganographyEncryptButton = document.getElementById("steganographyEncryptButton");
steganographyEncryptButton.addEventListener("click", () => {
  const text = document.getElementById("steganographyText").value;
  if(orchestrator){
    orchestrator.steganographyEncrypt(text);
    console.log("ENCRYPTED: " + text);
  }
});
const steganographyDecryptButton = document.getElementById("steganographyDecryptButton");
steganographyDecryptButton.addEventListener("click", () => {
  if(orchestrator)
    document.getElementById("steganographyText").value = orchestrator.steganographyDecrypt();
});

const normalizeButton = document.getElementById("normalizeButton");
normalizeButton.addEventListener("click", () => {
  if(orchestrator){
    let divisor = orchestrator.getBiggestIntensity();
    orchestrator.intensityTransform(normalize(divisor), true);
  }
});

const histogramEqualizationButton = document.getElementById("histogramEqualizationButton");
histogramEqualizationButton.addEventListener("click", () =>{
  if(orchestrator)
    orchestrator.histogramEqualization();
});

const applyPiecewise = document.getElementById("applyPiecewise");
applyPiecewise.addEventListener("click", () => {
  if(orchestrator){
    orchestrator.do();
    closePiecewise();
  }
});

const dimensionGauss = document.getElementById("dimensionGauss");
const sigmaGauss = document.getElementById("sigmaGauss");
const applyGaussianButton = document.getElementById("applyGaussianButton");
applyGaussianButton.addEventListener("click", () => {
  if(orchestrator){
    let n = parseInt(dimensionGauss.value);
    let sigma = parseFloat(sigmaGauss.value);
    let mid = Math.floor(n/2.0);
    orchestrator.applyKernel(gaussianKernel(n, sigma), mid, mid, true);
  }
});

const dimensionMean = document.getElementById("dimensionMean");
const applyMeanButton = document.getElementById("applyMeanButton");
applyMeanButton.addEventListener("click", () => {
  if(orchestrator){
    let n = parseInt(dimensionMean.value);
    let mid = Math.floor(n/2.0);
    orchestrator.applyKernel(meanKernel(n), mid, mid, true);
  }
});

const dimensionMedian = document.getElementById("dimensionMedian");
const applyMedianButton = document.getElementById("applyMedianButton");
applyMedianButton.addEventListener("click", () => {
  if(orchestrator){
    let n = parseInt(dimensionMedian.value);
    let mid = Math.floor(n/2.0);
    orchestrator.medianFilter(n, mid, mid, true);
  }
});

const kernelText = document.getElementById("kernelText");
const kernelTextButton = document.getElementById("kernelTextButton");
kernelTextButton.addEventListener("click", () => {
  if(orchestrator){
    let kernel = JSON.parse(kernelText.value);
    let n = parseInt(kernel.length);
    let mid = Math.floor(n/2.0);
    orchestrator.applyKernel(kernel, mid, mid, true);
  }
});

function applyLaplacian(){
  if(orchestrator){
    let n = 3;
    let mid = Math.floor(n/2.0);
    orchestrator.applyKernel(laplacianKernel(), mid, mid, true);
    //normalize here
  }
}

function applyHighBoost(){
  if(orchestrator){
    let n = document.getElementById("dimensionHigh").value;
    let sigma = document.getElementById("sigmaHigh").value;
    let k = document.getElementById("kHigh").value;
    let mid = Math.floor(n/2.0);
    let img = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgBlur = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    imgBlur.applyKernel(gaussianKernel(n, sigma), mid, mid);
    let imgMask = binOperationIMG(img, imgBlur, minus);
    imgMask.intensityTransform(unaryOperationPX(x => k*x));
    let highboosted = binOperationIMG(img, imgMask, sum);
    orchestrator.addImage(highboosted);
    //normalize here
  }
}

function applySobel(){
  if(orchestrator){
    let n = 3;
    let mid = Math.floor(n/2.0);
    let imgA = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgB = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    imgA.applyKernel(sobelXKernel(), mid, mid);
    imgB.applyKernel(sobelYKernel(), mid, mid);
    imgA.intensityTransform(unaryOperationPX(x => x*x));
    imgB.intensityTransform(unaryOperationPX(x => x*x));
    let imgC = binOperationIMG(imgA, imgB, sum);
    imgC.intensityTransform(unaryOperationPX(x => Math.sqrt(x)));
    orchestrator.addImage(imgC);
    //normalize here
  }

}

// Geometric Transformations

const scaleWN = document.getElementById("scaleWN");
const scaleHN = document.getElementById("scaleHN");
const scaleNoneButton = document.getElementById("scaleNoneButton");
scaleNoneButton.addEventListener("click", () => {
  if(orchestrator){
    let imgAux = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgScaled = imgAux.scaleNone(scaleWN.value, scaleHN.value);
    orchestrator.addImage(imgScaled);
  }
});

const scaleWL = document.getElementById("scaleWL");
const scaleHL = document.getElementById("scaleHL");
const scaleLinearButton = document.getElementById("scaleLinearButton");
scaleLinearButton.addEventListener("click", () => {
  if(orchestrator){
    let imgAux = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgScaled = imgAux.scaleLinear(scaleWL.value, scaleHL.value);
    orchestrator.addImage(imgScaled);
  }
});

const angleN = document.getElementById("angleN");
const rotationNoneButton = document.getElementById("rotationNoneButton");
rotationNoneButton.addEventListener("click", () => {
  if(orchestrator){
    let imgAux = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgRotated = imgAux.rotationLinear(angleN.value);
    orchestrator.addImage(imgRotated);
  }
});

const angleL = document.getElementById("angleL");
const rotationLinearButton = document.getElementById("rotationLinearButton");
rotationLinearButton.addEventListener("click", () => {
  if(orchestrator){
    let imgAux = copyImage(orchestrator.imageHistory[orchestrator.imageHistory.length-1]);
    let imgRotated = imgAux.rotationLinear(angleL.value);
    orchestrator.addImage(imgRotated);
  }
});
