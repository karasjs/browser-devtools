import enums from '../enums';
import { root2json } from '../convert';

let div = document.createElement('div');
div.style.zIndex = 10000000;
div.style.position = 'fixed';
div.style.backgroundColor = 'rgba(120, 170, 210, 0.7)';
div.style.pointerEvents = 'none';

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
    if(isOnKarasCanvas) {
      document.body.removeChild(div);
      isOnKarasCanvas = false;
      window.postMessage({
        KARAS_DEVTOOLS: true,
        key: enums.INIT_ROOT_JSON,
        value: root2json(karas, root),
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
    div.style.width = div.style.height = 0;
    div.style.transform = null;
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
        div.style.left = rect.left + sx * scx + 'px';
        div.style.top = rect.top + sy * scx + 'px';
        div.style.width = outerWidth * scx + 'px';
        div.style.height = outerHeight * scx + 'px';
        div.style.transform = `matrix3d(${matrixEvent.join(',')})`;
      }
      else {
        div.style.left = rect.left + 'px';
        div.style.top = rect.top + 'px';
        div.style.width = rect.width + 'px';
        div.style.height = rect.height + 'px';
      }
      document.body.appendChild(div);
    }
  },
  mouseLeave(prefix) {
    document.body.removeChild(div);
  },
};

// function detectKaras() {
//   if(window.karas && typeof karas.render === 'function' && karas.version) {
//     window.postMessage({
//       KARAS_DEVTOOLS: true,
//       key: enums.DETECT,
//       value: true,
//     }, '*');
//   }
//   else {
//     window.postMessage({
//       KARAS_DEVTOOLS: true,
//       key: enums.DETECT,
//       value: false,
//     }, '*');
//   }
// }
//
// document.addEventListener('visibilitychange',function() { //浏览器切换事件
//   if(document.visibilityState === 'visible') { //状态判断
//     detectKaras();
//   }
// });
//
// detectKaras();
