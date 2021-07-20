import enums from '../enums';
import { rootTree, vdJson } from '../convert';

let div = document.createElement('div');
div.style.zIndex = 10000000;
div.style.position = 'fixed';
div.style.pointerEvents = 'none';
let margin = document.createElement('div');
margin.style.position = 'absolute';
margin.style.boxSizing = 'border-box';
margin.style.borderStyle = 'solid';
margin.style.borderColor = 'rgba(255, 155, 0, 0.3)';
let border = document.createElement('div');
border.style.boxSizing = 'border-box';
border.style.width = border.style.height = '100%';
border.style.borderStyle = 'solid';
border.style.borderColor = 'rgba(255, 200, 50, 0.3)';
let padding = document.createElement('div');
padding.style.boxSizing = 'border-box';
padding.style.width = padding.style.height = '100%';
padding.style.borderStyle = 'solid';
padding.style.borderColor = 'rgba(77, 200, 0, 0.3)';
let content = document.createElement('div');
content.style.boxSizing = 'border-box';
content.style.width = content.style.height = '100%';
content.style.backgroundColor = 'rgba(120, 170, 210, 0.7)';
padding.appendChild(content);
border.appendChild(padding);
margin.appendChild(border);
div.appendChild(margin);

function setMBP(m, b, p) {
  margin.style.borderTopWidth = (m[0] || 0) + 'px';
  margin.style.borderRightWidth = (m[1] || 0) + 'px';
  margin.style.borderBottomWidth = (m[2] || 0) + 'px';
  margin.style.borderLeftWidth = (m[3] || 0) + 'px';
  border.style.borderTopWidth = (b[0] || 0) + 'px';
  border.style.borderRightWidth = (b[1] || 0) + 'px';
  border.style.borderBottomWidth = (b[2] || 0) + 'px';
  border.style.borderLeftWidth = (b[3] || 0) + 'px';
  padding.style.borderTopWidth = (p[0] || 0) + 'px';
  padding.style.borderRightWidth = (p[1] || 0) + 'px';
  padding.style.borderBottomWidth = (p[2] || 0) + 'px';
  padding.style.borderLeftWidth = (p[3] || 0) + 'px';
}

let target;
let root;
let isOnKarasCanvas;
let isInspectCanvas;
let isInspectElement;
document.addEventListener('mousemove', function(e) {
  if(isInspectElement) {
    console.log(root);
  }
  else if(isInspectCanvas) {
    if(e.target !== target) {
      target = e.target;
      if(['canvas', 'svg'].indexOf(target.tagName.toLowerCase()) > -1) {
        if(window.karas && karas.Root && target.__root && target.__root instanceof karas.Root) {
          root = target.__root;
          let rect = target.getBoundingClientRect();
          div.style.left = rect.left + 'px';
          div.style.top = rect.top + 'px';
          div.style.width = rect.width + 'px';
          div.style.height = rect.height + 'px';
          setMBP([], [], []);
          margin.style.width = margin.style.height = '100%';
          margin.style.left = margin.style.top = 0;
          document.body.appendChild(div);
          window.postMessage({
            KARAS_DEVTOOLS: true,
            key: enums.IS_KARAS_CANVAS,
            value: true,
          }, '*');
          isOnKarasCanvas = true;
          return;
        }
      }
      // 之前在karas的canvas/svg上显示，现在不在了要移除
      if(isOnKarasCanvas) {
        document.body.removeChild(div);
      }
      isOnKarasCanvas = false;
      window.postMessage({
        KARAS_DEVTOOLS: true,
        key: enums.IS_KARAS_CANVAS,
        value: false,
      }, '*');
    }
  }
});
document.addEventListener('click', function() {
  if(isInspectCanvas) {
    isInspectCanvas = false;
    window.postMessage({
      KARAS_DEVTOOLS: true,
      key: enums.END_INSPECT_CANVAS,
    }, '*');
    // 在模板canvas上点击选中，移除
    if(isOnKarasCanvas) {
      document.body.removeChild(div);
      isOnKarasCanvas = false;
      window.postMessage({
        KARAS_DEVTOOLS: true,
        key: enums.INIT_ROOT_JSON,
        value: rootTree(karas, root),
      }, '*');
    }
    else {
    }
    __KARAS_DEVTOOLS__.endInspectCanvas();
  }
});

let __KARAS_DEVTOOLS__ = window.__KARAS_DEVTOOLS__ = {
  startInspectCanvas() {
    isInspectCanvas = true;
  },
  endInspectCanvas() {
    isInspectCanvas = false;
  },
  mouseEnter(prefix) {
    setMBP([], [], []);
    margin.style.transform = null;
    if(root) {
      let rect = target.getBoundingClientRect();
      let scx = root.__scx;
      if(scx === undefined) {
        scx = rect.width / root.width;
      }
      let scy = root.__scy;
      if(scy === undefined) {
        scy = rect.height / root.height;
      }
      if(prefix) {
        let vd = root;
        let path = prefix.split(',');
        while(path.length) {
          let index = path.shift();
          vd = vd.children[index];
          if(!vd) {
            return;
          }
        }
        let { sx, sy, outerWidth, outerHeight, matrixEvent } = vd;
        margin.style.left = sx * scx + 'px';
        margin.style.top = sy * scx + 'px';
        margin.style.width = outerWidth * scx + 'px';
        margin.style.height = outerHeight * scx + 'px';
        let computedStyle;
        if(vd instanceof karas.Text) {
          computedStyle = {};
        }
        else {
          computedStyle = vd.getComputedStyle();
        }
        setMBP([
          computedStyle.marginTop,
          computedStyle.marginRight,
          computedStyle.marginBottom,
          computedStyle.marginLeft,
        ], [
          computedStyle.borderTopWidth,
          computedStyle.borderRightWidth,
          computedStyle.borderBottomWidth,
          computedStyle.borderLeftWidth,
        ], [
          computedStyle.paddingTop,
          computedStyle.paddingRight,
          computedStyle.paddingBottom,
          computedStyle.paddingLeft,
        ]);
        if(matrixEvent.length === 6) {
          margin.style.transform = `matrix(${matrixEvent.join(',')})`;
        }
        else if(matrixEvent.length === 16) {
          margin.style.transform = `matrix3d(${matrixEvent.join(',')})`;
        }
      }
      else {
        margin.style.width = margin.style.height = '100%';
        margin.style.left = margin.style.top = 0;
      }
      document.body.appendChild(div);
    }
  },
  mouseLeave(prefix) {
    document.body.removeChild(div);
  },
  click(prefix) {
    if(root) {
      let vd = root;
      let path = prefix ? prefix.split(',') : [];
      while(path.length) {
        let index = path.shift();
        vd = vd.children[index];
        if(!vd) {
          return;
        }
      }
      let value = vdJson(karas, vd);
      value.prefix = prefix;
      window.postMessage({
        KARAS_DEVTOOLS: true,
        key: enums.CLICK_ELEMENT,
        value,
      }, '*');
    }
  },
  enterBox(type, prefix) {
    this.mouseEnter(prefix);
    margin.style.visibility
      = border.style.visibility
      = padding.style.visibility
      = content.style.visibility
      = 'hidden';
  },
  leaveBox(type) {
    margin.style.visibility
      = border.style.visibility
      = padding.style.visibility
      = content.style.visibility
      = 'visible';
    document.body.removeChild(div);
  },
  overBox(type) {
    margin.style.visibility
      = border.style.visibility
      = padding.style.visibility
      = content.style.visibility
      = 'hidden';
    let o = {
      margin,
      border,
      padding,
      content,
    }[type];
    o.style.visibility = 'visible';
  },
};
