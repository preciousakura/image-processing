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

  toHSI(){
    let i = (r+g+b)/3.0;
    let s = (i == 0 ? 0 : 1-i*Math.min(r, g, b));
    let h = 0;
    if(s != 0){
      let numerator = (0.5*((r-g)+(r-b)));
      let denominator = Math.sqrt((r-g)*(r-g)+(r-b)*(g-b));
      let theta = Math.acos(numerator/denominator);
      h = theta;
      h = (180*h/Math.PI); //converting to degree
      h = ((b <= g) ? h : 360-h);
    }
    return [h, s, i];
  }

  toHSV(){
    let r = this.r, g = this.g, b = this.b;
    let mmax = Math.max(r, g, b), mmin = Math.min(r, g, b);
    let v = Math.max(r, g, b);
    let s = (v == 0) ? 0 : (v-mmin)/v;
    let h = 0;
    if(s != 0){
      if(mmax == r) h = 60*((g-b)/(mmax-mmin));
      else if(mmax == g) h = 60*(2+(b-r)/(mmax-mmin));
      else h = 60*(4+(r-g)/(mmax-mmin));
    }
    if(h < 0) h += 360;
    return [h, s, v];
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

function toHSI(r, g, b){
  let i = (r+g+b)/3.0;
  let s = (i == 0 ? 0 : 1-i*Math.min(r, g, b));
  let h = 0;
  if(s != 0){
    let numerator = (0.5*((r-g)+(r-b)));
    let denominator = Math.sqrt((r-g)*(r-g)+(r-b)*(g-b));
    let theta = Math.acos(numerator/denominator);
    h = theta;
    h = (180*h/Math.PI); //converting to degree
    h = ((b <= g) ? h : 360-h);
  }
  return [h, s, i];
}

function toHSV(r, g, b){
  let mmax = Math.max(r, g, b), mmin = Math.min(r, g, b);
  let v = Math.max(r, g, b);
  let s = (v == 0) ? 0 : (v-mmin)/v;
  let h = 0;
  if(s != 0){
    if(mmax == r) h = 60*((g-b)/(mmax-mmin));
    else if(mmax == g) h = 60*(2+(b-r)/(mmax-mmin));
    else h = 60*(4+(r-g)/(mmax-mmin));
  }
  if(h < 0) h += 360;
  return [h, s, v];
}
