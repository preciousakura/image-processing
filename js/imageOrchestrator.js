class imageOrchestrator{
    constructor(_img, _context){
        this.width = _img.width;
        this.height = _img.height;
        this.colorBuffer = _img;
        this.imgTemp = new image(this.colorBuffer.data, _img.width, _img.height);
        this.imageHistory = [new image(this.colorBuffer.data, _img.width, _img.height)];
        this.context = _context;
        this.showChanges();
    }

    recoverLastImage(){
        let lastImage = this.imageHistory[this.imageHistory.length-1];
        let lastBuffer = lastImage.toArrayRGBA();
        for(let i = 0; i < this.colorBuffer.data.length; i++) this.colorBuffer.data[i] = lastBuffer[i];
        this.imgTemp = new image(lastBuffer, this.width, this.height);
    }

    intensityTransform(T, apply=false){
        this.recoverLastImage();
        this.imgTemp.intensityTransform(T);
        const arrayImage = this.imgTemp.toArrayRGBA();
        for(let i = 0; i < this.colorBuffer.data.length; i++) this.colorBuffer.data[i] = arrayImage[i];
        this.showChanges();
        if(apply) this.do();
    }

    do(){
        this.imageHistory.push(new image(this.colorBuffer.data, this.width, this.height));
        this.showChanges();
    }

    undo(){
        if(this.imageHistory.length >= 2){
            this.imageHistory.pop();
            this.recoverLastImage();
            this.showChanges();
        }
    }

    showChanges(){
        this.context.putImageData(this.colorBuffer, 0, 0, 0, 0, this.width, this.height);
        drawHistogram(this.intensityHistogram());
    }

    getBiggestIntensity(){
        let maxIntensity = 0.0;
        for(let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++)
                maxIntensity = Math.max(maxIntensity, this.imgTemp.matrix[i][j].max());
        return maxIntensity;
    }

    intensityHistogram(){
        let histogram = new Array(256).fill(0);
        for(let i = 0; i < this.colorBuffer.data.length; i += 4){
            ++histogram[this.colorBuffer.data[i]];
            // ++histogram[this.colorBuffer.data[i+1]];
            // ++histogram[this.colorBuffer.data[i+2]];
        }
        return histogram;
    }

    intensityProbabilities(){
        let probabilities = this.intensityHistogram();
        for(let i = 0; i < 256; i++) probabilities[i] /= (this.width*this.height);
        return probabilities;
    }

    histogramEqualizationMap(){
        let map = new Array(256).fill(0);
        let prefixSumProbabilities = this.intensityProbabilities();
        for(let i = 1; i < 256; i++) prefixSumProbabilities[i] += prefixSumProbabilities[i-1];
        for(let i = 0; i < 256; i++) map[i] = Math.round(prefixSumProbabilities[i]*255.0);
        return map;
    }

    histogramEqualization(){
        let map = this.histogramEqualizationMap();
        for(let i = 0; i < this.colorBuffer.data.length; i++){
            if(i%4 == 3) continue;
            this.colorBuffer.data[i] = map[this.colorBuffer.data[i]];
        }
        this.do();
    }

    steganographyEncrypt(binaryText){
        let fullMask = (1<<8)-1;
        for(let i = 0; i < this.colorBuffer.data.length; i++){
            let bit = (i < binaryText.length ? binaryText[i] == '1' : false);
            this.colorBuffer.data[i] &= (fullMask^(1-bit));
            this.colorBuffer.data[i] |= bit;
        }
        this.do();
    }

    steganographyDecrypt(){
        let encryptedText = "";
        for(let i = 0; i < this.colorBuffer.data.length; i++)
            encryptedText += (this.colorBuffer.data[i]&1 ? "1" : "0");
        return encryptedText;
    }
}
