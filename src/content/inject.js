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
    __KARAS_DEVTOOLS__.endInspectCanvas();
    target = null;
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
    console.log(prefix);
    let path = prefix.split(',');
    if(root) {
      // while(path.length) {}
    }
  },
  mouseLeave(prefix) {},
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
