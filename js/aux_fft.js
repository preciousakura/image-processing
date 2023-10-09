function fftshift(img){
    let N = img[0].length, M = img.length;
    let imgs = [];
    for(let i = 0; i < M; i++){
        row = [];
        for(let j = 0; j < N; j++) row.push(0);
        imgs.push(row);
    }
    let N2 = Math.floor(N/2), M2 = Math.floor(M/2);
    for(let i = 0; i < M; i++)
        for(let j = 0; j < N; j++)
            imgs[(i+M2)%M][(j+N2)%N] = img[i][j];
    return imgs;
}

function fftishift(img){
    let N = img[0].length, M = img.length;
    let imgs = [];
    for(let i = 0; i < M; i++){
        row = [];
        for(let j = 0; j < N; j++) row.push(0);
        imgs.push(row);
    }
    let N2 = Math.floor(N/2), M2 = Math.floor(M/2);
    for(let i = 0; i < M; i++)
        for(let j = 0; j < N; j++)
            imgs[(i-M2+M)%M][(j-N2+N)%N] = img[i][j];
    return imgs;
}

function nearest_power2(n){
  let size = 1;
  while(size < n) size *= 2;
  return size;
}

function transform_array(a){
  let aux = [...a], size = nearest_power2(a.length);
  while(aux.length != size) aux.push(0);
  for(let i = 0; i < size; i++) if(typeof aux[i] != "object") aux[i] = new complex(aux[i], 0);
  return aux;
}

function padding_array(a, n){
  while(a.length != n) a.push(0);
}

function transform_image(m){
  let aux = [];
  let N = m.length, M = m[0].length;
  let dimension = nearest_power2(Math.max(N, M));
  for(let i = 0; i < dimension; i++){
    let row = (i < N ? [...m[i]] : []);
    padding_array(row, dimension);
    aux.push(row);
  }
  return aux;
}
