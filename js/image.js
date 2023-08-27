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

    intensityTransform(T){
        for(let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++)
                this.matrix[i][j] = T(this.matrix[i][j]);
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
