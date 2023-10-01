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
