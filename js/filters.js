function gaussianKernel(dimension, sigma){
    let kernel = [];
	let s = 2.0*sigma*sigma; dimension >>= 1;
	for(let i = -dimension; i <= dimension; i++){
        let row = [];
		for(let j = -dimension; j <= dimension; j++)
            row.push((Math.exp(-((i*i+j*j)/(s))))/(s*Math.PI));
        kernel.push(row);
    }
    const sum = kernel.flat().reduce((acc, val) => acc + val, 0);
    return kernel.map(row => row.map(val => val / sum));
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

function laplacianKernel(){
    return [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
}

function sobelXKernel(){
    return [[-1, -2, -1], [0, 0, 0], [1, 2 ,1]];
}

function sobelYKernel(){
    return [[-1, 0, 1], [-2, 0, 2], [-1, 0 ,1]];
}
