let script = document.createElement('script');
script.src = chrome.extension.getURL('inject.js');
script.onload = function() {
  this.parentNode.removeChild(this);
};
document.head.appendChild(script);

window.addEventListener('message', function(e) {
  // console.log(e);
  let data = e.data;
  if(data && data.KARAS_DEVTOOLS) {
    chrome.runtime.sendMessage(data);
  }
});
