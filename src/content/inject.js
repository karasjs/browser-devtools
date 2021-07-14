import enums from '../enums';

console.log('content', window.karas);

function detectKaras() {
  if(window.karas && typeof karas.render === 'function' && karas.version) {
    console.log(karas.version);
    window.postMessage({
      KARAS_DEVTOOLS: true,
      key: enums.DETECT,
      value: true,
    }, '*');
  }
  else {
    window.postMessage({
      KARAS_DEVTOOLS: true,
      key: enums.DETECT,
      value: false,
    }, '*');
  }
}

document.addEventListener('visibilitychange',function() { //浏览器切换事件
  if(document.visibilityState === 'visible') { //状态判断
    detectKaras();
  }
});

detectKaras();
