const toGrayButton = document.getElementById("toGrayButton");
toGrayButton.addEventListener("click", () => {
        if(orchestrator)
            orchestrator.intensityTransform(toGray, true);
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
