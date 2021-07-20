function vdTree(karas, vd) {
  let res = {
    tagName: vd.tagName,
  };
  if(Array.isArray(vd.children)) {
    res.children = vd.children.map(item => {
      if(item instanceof karas.Text) {
        return {
          tagName: 'text',
          content: item.content,
        };
      }
      return vdTree(karas, item);
    });
  }
  return res;
}

export function rootTree(karas, root) {
  return vdTree(karas, root);
}

function translateStyleKey(karas, json) {
  let res = {};
  let STYLE_RV_KEY = karas.enums.STYLE_RV_KEY;
  Object.keys(json).forEach(k => {
    let k2 = STYLE_RV_KEY[k];
    res[k2] = json[k];
  });
  return res;
}

export function vdJson(karas, vd) {
  return {
    x: vd.x,
    y: vd.y,
    ox: vd.ox,
    oy: vd.oy,
    sx: vd.sx,
    sy: vd.sy,
    width: vd.width,
    height: vd.height,
    clientWidth: vd.clientWidth,
    clientHeight: vd.clientHeight,
    offsetWidth: vd.offsetWidth,
    offsetHeight: vd.offsetHeight,
    style: translateStyleKey(karas, vd.style),
    currentStyle: translateStyleKey(karas, vd.currentStyle),
    computedStyle: translateStyleKey(karas, vd.computedStyle),
  };
}
