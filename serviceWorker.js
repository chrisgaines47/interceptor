chrome.tabs.create({
    url: 'background/background.html'
});

function messageHandler(message, sender, sendResponse) {
    if(message.type === 'UPDATE') {
        chrome.storage.local.set({[message.url] : message.data});
    } else if (message.type === 'DELETE') {
        chrome.storage.local.remove([message.url]);
    } else if (message.type === 'GET') {
        chrome.storage.local.get(null, items => {
            sendResponse(items);
        });
    }
}

chrome.runtime.onMessage.addListener(messageHandler);