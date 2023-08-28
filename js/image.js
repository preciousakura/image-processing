class image{
    constructor(array_pixels, _width, _height){
        this.width = _width;
        this.height = _height;
        this.matrix = [];
        for(let i = 0, c = 0; i < this.height; i++){
            let row = [];
            for(let j = 0; j < this.width; j++, c += 4)
                row.push(new pixel(array_pixels[c]/255.0, array_pixels[c+1]/255.0, array_pixels[c+2]/255.0, array_pixels[c+3]/255.0));
            this.matrix.push(row);
        }
    }

    pixelInImage(i, j){
        return i >= 0 && i < this.height && j >= 0 && j < this.width;
    }

    intensityTransform(T){
        for(let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++)
                this.matrix[i][j] = T(this.matrix[i][j]);
    }

    applyKernelPixel(k, ki, kj, i, j){
        let n = k.length; //kernel dimension is n x n
        let i_min = i-ki, i_max = i+n-ki-1
        let j_min = j-kj, j_max = j+n-kj-1;
        let px = new pixel(0.0, 0.0, 0.0, 1.0), zero = new pixel(0.0, 0.0, 0.0, 0.0);
        for(let x = i_min, i = 0; x <= i_max; i++, x++)
            for(let y = j_min, j = 0; y <= j_max; j++, y++){
                let pxImage = this.pixelInImage(x, y) ? this.matrix[x][y] : zero;
                px = px.addPixel(pxImage.multScalar(k[i][j]));
            }
        return px;
    }

    applyKernel(k, ki, kj){
        for(let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++)
                this.matrix[i][j] = this.applyKernelPixel(k, ki, kj, i, j);
    }

    getMedianKernel(n, ki, kj, i, j){
        let i_min = i-ki, i_max = i+n-ki-1
        let j_min = j-kj, j_max = j+n-kj-1;
        let pxs = [];
        for(let x = i_min; x <= i_max; x++)
            for(let y = j_min; y <= j_max; y++)
                if(this.pixelInImage(x, y))
                    pxs.push(this.matrix[x][y]);
        pxs.sort((a, b) => (a.r+a.g+a.b) - (b.r+b.g+b.b));
        return pxs[Math.floor(pxs.length/2.0)];
    }

    medianFilter(dimension, ki, kj){
        for(let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++)
                this.matrix[i][j] = this.getMedianKernel(dimension, ki, kj, i, j);
    }

    toArrayRGBA(){
        let buffer = [];
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                buffer.push(Math.round(this.matrix[i][j].r*255));
                buffer.push(Math.round(this.matrix[i][j].g*255));
                buffer.push(Math.round(this.matrix[i][j].b*255));
                buffer.push(Math.round(this.matrix[i][j].a*255));
            }
        }
        return buffer;
    }
}
