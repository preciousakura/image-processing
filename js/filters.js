function gaussianKernel(dimension){
    //TODO: Calc Kernell for any odd dimension
    return [[0, 1/8, 0], [1/8, 4/8, 1/8], [0, 1/8, 0]];
}

function meanKernel(dimension){
    let div = dimension*dimension;
    let k = [];
    for(let i = 0; i < dimension; i++){
        let row = [];
        for(let j = 0; j < dimension; j++)
            row.push(1/div);
        k.push(row);
    }
    return k;
}
