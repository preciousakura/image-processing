let N, M;
let img;

function W(u, v, x, y, inverse){
    let e = new complex(0, (inverse ? 1 : -1)*2*Math.PI*((u*x/M) + (v*y/N)));
    return epow(e);
}

function F(u, v, inverse){
    let acm = new complex(0, 0);
    for(let x = 0; x < M; x++){
        for(let y = 0; y < N; y++){
            let fxy = img[x][y];
            acm = add(acm, mult(fxy, W(u, v, x, y, inverse)));
        }
    }
    if(inverse) acm = div(acm, N*M);
    return acm;
}

function naive_fft(a, inverse=false){
    transform_complex(a);
    let fft = [];
    for(let u = 0; u < M; u++){
        let row = [];
        for(let v = 0; v < N; v++) row.push(F(u, v, inverse));
        fft.push(row);
    }
    return fft;
}

function transform_complex(a){
    N = a[0].length, M = a.length;
    img = [];
    for(let u = 0; u < M; u++){
        img.push([]);
        for(let v = 0; v < N; v++){
            if(typeof a[u][v] != "object")
                img[u].push(new complex(a[u][v], 0));
            else 
                img[u].push(a[u][v]);
        }
    }
}
