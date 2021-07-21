// 判断点是否在一个4边形内，比如事件发生是否在节点上
function pointInQuadrilateral(karas, x, y, x1, y1, x2, y2, x4, y4, x3, y3, matrix) {
  if(matrix && !karas.math.matrix.isE(matrix)) {
    let w1, w2, w3, w4;
    [x1, y1,, w1] = karas.math.matrix.calPoint([x1, y1], matrix);
    [x2, y2,, w2] = karas.math.matrix.calPoint([x2, y2], matrix);
    [x3, y3,, w3] = karas.math.matrix.calPoint([x3, y3], matrix);
    [x4, y4,, w4] = karas.math.matrix.calPoint([x4, y4], matrix);
    if(w1 && w1 !== 1) {
      x1 /= w1;
      y1 /= w1;
    }
    if(w2 && w2 !== 1) {
      x2 /= w2;
      y2 /= w2;
    }
    if(w3 && w3 !== 1) {
      x3 /= w3;
      y3 /= w3;
    }
    if(w4 && w4 !== 1) {
      x4 /= w4;
      y4 /= w4;
    }
    return karas.math.geom.pointInPolygon(x, y, [
      [x1, y1],
      [x2, y2],
      [x4, y4],
      [x3, y3]
    ]);
  }
  else {
    return x >= x1 && y >= y1 && x <= x4 && y <= y4;
  }
}

function willResponseEvent(karas, vd, x, y, prefix = '') {
  let { __sx1, __sy1, offsetWidth, offsetHeight, matrixEvent, children, zIndexChildren } = vd;
  if(Array.isArray(zIndexChildren)) {
    for(let i = 0, len = children.length; i < len; i++) {
      children[i].__index__ = i;
    }
    for(let i = 0, len = zIndexChildren.length; i < len; i++) {
      let item = zIndexChildren[i];
      if(item instanceof karas.Text) {
        continue;
      }
      let path = prefix ? (prefix + ',' + item.__index__) : String(item.__index__);
      let res = willResponseEvent(karas, item, x, y, path);
      if(res) {
        return res;
      }
    }
  }
  let inThis = pointInQuadrilateral(
    karas, x, y,
    __sx1, __sy1,
    __sx1 + offsetWidth, __sy1,
    __sx1 + offsetWidth, __sy1 + offsetHeight,
    __sx1, __sy1 + offsetHeight,
    matrixEvent
  );
  if(inThis) {
    return prefix;
  }
}

export default willResponseEvent;
