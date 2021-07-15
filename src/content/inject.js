import enums from '../enums';

let div = document.createElement('div');
div.style.zIndex = 10000000;
div.style.position = 'fixed';
div.style.backgroundColor = 'rgba(120, 170, 210, 0.7)';
div.style.pointerEvents = 'none';

let target;
let isOnCanvas;
let isInspect;
document.addEventListener('mousemove', function(e) {
  if(isInspect) {
    if(e.target !== target) {
      console.log(e.target)
      target = e.target;
      if(['canvas', 'svg'].indexOf(target.tagName.toLowerCase()) > -1) {
        let rect = target.getBoundingClientRect();
        div.style.left = rect.left + 'px';
        div.style.top = rect.top + 'px';
        div.style.width = rect.width + 'px';
        div.style.height = rect.height + 'px';
        document.body.appendChild(div);
        isOnCanvas = true;
        if(window.karas && target.__root && target.__root instanceof window.karas.Root) {
          window.postMessage({
            KARAS_DEVTOOLS: true,
            key: enums.IS_CANVAS_KARAS,
            value: true,
          }, '*');
        }
        else {
          window.postMessage({
            KARAS_DEVTOOLS: true,
            key: enums.IS_CANVAS_KARAS,
            value: false,
          }, '*');
        }
      }
      else if(isOnCanvas) {
        document.body.removeChild(div);
        isOnCanvas = false;
        window.postMessage({
          KARAS_DEVTOOLS: true,
          key: enums.IS_CANVAS_KARAS,
          value: false,
        }, '*');
      }
      else {
        window.postMessage({
          KARAS_DEVTOOLS: true,
          key: enums.IS_CANVAS_KARAS,
          value: false,
        }, '*');
      }
    }
  }
});
document.addEventListener('click', function() {
  console.log('click')
  if(isInspect) {
    target = null;
    isInspect = false;
    if(isOnCanvas) {
      document.body.removeChild(div);
      isOnCanvas = false;
    }
    window.postMessage({
      KARAS_DEVTOOLS: true,
      key: enums.END_INSPECT,
    }, '*');
  }
});

window.__KARAS_DEVTOOLS__ = {
  startInspect() {
    isInspect = true;
  },
  endInspect() {
    isInspect = false;
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
