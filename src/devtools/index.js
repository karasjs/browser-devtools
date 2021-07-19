import './devtools.html';
import enums from '../enums';

chrome.devtools.panels.create("Karas",
  "logo.png",
  "panel.html",
  function(panel) {
    // code invoked on panel creation
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'loading') {
    chrome.runtime.sendMessage({
      KARAS_DEVTOOLS: true,
      key: enums.TAB_UPDATE,
      value: changeInfo.status,
    });
  }
});
