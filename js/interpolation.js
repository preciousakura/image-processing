function nearest_neighborhood(i, j, img){
  i = Math.round(i); j = Math.round(j);
  return img.pixelInImage(i, j) ? img.matrix[i][j] : new pixel(0, 0, 0, 1);
}

function bilinear_interpolation(i, j, img){
  let x1 = Math.floor(i), x2 = Math.ceil(i);
  let y1 = Math.floor(j), y2 = Math.ceil(j);
  if(x1 == x2) --x1;
  if(y1 == y2) --y1;
  let px1 = binOperationPX(
    (img.pixelInImage(x1, y1) ? img.matrix[x1][y1].multScalar(x2-i) : new pixel(0, 0, 0, 1)),
    (img.pixelInImage(x2, y1) ? img.matrix[x2][y1].multScalar(i-x1) : new pixel(0, 0, 0, 1)),
    (x, y) => x+y
  );
  let px2 = binOperationPX(
    (img.pixelInImage(x1, y2) ? img.matrix[x1][y2].multScalar(x2-i) : new pixel(0, 0, 0, 1)),
    (img.pixelInImage(x2, y2) ? img.matrix[x2][y2].multScalar(i-x1) : new pixel(0, 0, 0, 1)),
    (x, y) => x+y
  );
  return binOperationPX(px1.multScalar(y2-j), px2.multScalar(j-y1), (x, y) => x+y);
}
