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
    let r = this.r, g = this.g, b = this.b;
    let i = (r+g+b)/3.0;
    let s = (i == 0 ? 0 : 1-i*Math.min(r, g, b));
    let h = 0;
    let numerator = (0.5*((r-g)+(r-b)));
    let eps = 1e-9;
    let denominator = Math.sqrt((r-g)*(r-g)+(r-b)*(g-b))+eps;
    let theta = Math.acos(numerator/denominator);
    h = theta;
    h = (180*h/Math.PI); //converting to degree
    h = ((b <= g) ? h : 360-h);
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

function rgbToHSI(r, g, b){
  let i = (r+g+b)/3.0;
  let s = (i == 0 ? 0 : 1-i*Math.min(r, g, b));
  let h = 0;
  let numerator = (0.5*((r-g)+(r-b)));
  let eps = 1e-9;
  let denominator = Math.sqrt((r-g)*(r-g)+(r-b)*(g-b))+eps;
  let theta = Math.acos(numerator/denominator);
  h = theta;
  h = (180*h/Math.PI); //converting to degree
  h = ((b <= g) ? h : 360-h);
  return [h, s, i];
}

function rgbToHSV(r, g, b){
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


function hsiToRGB(H, S, I) {
  H = H + 360;
  H -= Math.floor(H/360)*360;

  S = Math.min(Math.max(S, 0), 1);
  I = Math.min(Math.max(I, 0), 1);

  let R, G, B;

  if(S === 0){
    R = G = B = I;
  }else{
    const H_prime = H / 60;
    const chroma = (1 - Math.abs(2 * I - 1)) * S;
    const X = chroma * (1 - Math.abs((H_prime % 2) - 1));

    if (H_prime >= 0 && H_prime < 1) [R, G, B] = [chroma, X, 0];
    else if (H_prime >= 1 && H_prime < 2) [R, G, B] = [X, chroma, 0];
    else if (H_prime >= 2 && H_prime < 3) [R, G, B] = [0, chroma, X];
    else if (H_prime >= 3 && H_prime < 4) [R, G, B] = [0, X, chroma];
    else if (H_prime >= 4 && H_prime < 5) [R, G, B] = [X, 0, chroma];
    else [R, G, B] = [chroma, 0, X];

    const m = I-(chroma/2);
    R += m;
    G += m;
    B += m;
  }

  return [R, G, B];
}

function hsvToRGB(H, S, V) {
  S = Math.min(Math.max(S, 0), 1);
  V = Math.min(Math.max(V, 0), 1);

  let R, G, B;

  const C = V * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = V - C;

  if (H >= 0 && H < 60) [R, G, B] = [C, X, 0];
  else if (H >= 60 && H < 120) [R, G, B] = [X, C, 0];
  else if (H >= 120 && H < 180) [R, G, B] = [0, C, X];
  else if (H >= 180 && H < 240) [R, G, B] = [0, X, C];
  else if (H >= 240 && H < 300) [R, G, B] = [X, 0, C];
  else [R, G, B] = [C, 0, X];

  return [R + m, G + m, B + m]
}
