import enums from './enums';

function setIcon(type, tabId) {
  chrome.browserAction.setIcon({
    tabId: tabId,
    path: {
      '16': type + '.png',
      '32': type + '.png',
      '48': type + '.png',
      '128': type + '.png',
    },
  });
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(tabId, changeInfo, tab);
// });

chrome.runtime.onMessage.addListener((request, sender) => {
  if(sender.tab) {
    if(request.key === enums.DETECT) {
      setIcon(request.value ? 'logo' : 'disable', sender.tab.id);
    }
  }
});
