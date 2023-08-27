class pixel{
    constructor(_r, _g, _b, _a){
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }

    max(){
        return Math.max(this.r, this.g, this.b);
    }
}
