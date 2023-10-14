function calc_fft(a, invert){
  let n = a.length;
  if(n == 1) return;

  let a0 = [], a1 = [];
  for(let i = 0; 2 * i < n; i++){
    a0.push(a[2*i]);
    a1.push(a[2*i+1]);
  }

  calc_fft(a0, invert);
  calc_fft(a1, invert);

  let ang = 2 * Math.PI / n * (invert ? 1 : -1);
  let w = new complex(1, 0), wn = new complex(Math.cos(ang), Math.sin(ang));

  for(let i = 0; 2 * i < n; i++){
    a[i] = add(a0[i], mult(w, a1[i]));
    a[i+n/2] = minus_c(a0[i], mult(w, a1[i]));
    if (invert) {
      a[i] = div(a[i], 2);
      a[i+n/2] = div(a[i+n/2], 2);
    }
    w = mult(w, wn);
  }
}

function fft(a, invert=false){
  let aux = transform_array(a);
  calc_fft(aux, invert);
  return aux;
}

function fft2(img, invert){
  let img_aux = transform_image(img);
  let aux = [], N = img_aux[0].length, M = img_aux.length;
  for(let i = 0; i < M; i++) aux.push(fft(img_aux[i], invert));
  for(let j = 0; j < N; j++){
    let column = [];
    for(let i = 0; i < M; i++) column.push(aux[i][j]);
    let f = fft(column, invert);
    for(let i = 0; i < M; i++) aux[i][j] = f[i];
  }
  return aux;
}
