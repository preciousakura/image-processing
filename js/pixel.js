class pixel{
    constructor(_r, _g, _b, _a){
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }

    addPixel(px){
        return new pixel(this.r+px.r, this.g+px.g, this.b+px.b, 1.0);
    }

    multScalar(scalar){
        return new pixel(this.r*scalar, this.g*scalar, this.b*scalar, 1.0);
    }

    max(){
        return Math.max(this.r, this.g, this.b);
    }

    equal(px) {
        return this.r === px.r && this.g === px.g && this.b === px.b;
    }

    distance(px) {
        return Math.sqrt(Math.pow((this.r - px.r), 2) + Math.pow((this.g - px.g), 2) + Math.pow((this.b - px.b), 2))
    }
}

function unaryOperationPX(op){
    return function(px){
        return new pixel(op(px.r), op(px.g), op(px.b), 1.0);
    }
}

function binOperationPX(a, b, op){
    return new pixel(op(a.r, b.r), op(a.g, b.g), op(a.b, b.b), 1.0);
}
