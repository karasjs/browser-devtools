function vd2json(karas, vd) {
  let res = {
    tagName: vd.tagName,
    children: [],
  };
  if(Array.isArray(vd.children)) {
    res.children = vd.children.map(item => {
      if(item instanceof karas.Text) {
        return {
          tagName: 'text',
          content: item.content,
        };
      }
      return vd2json(karas, item);
    });
  }
  return res;
}

export function root2json(karas, root) {
  return vd2json(karas, root);
}
