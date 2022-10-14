var defaultEntries = {
    categories: [
        {
            label: 'Feature Flags',
            categoryId: 0,
            features: [
                {
                    featureName: 'Feature Flags',
                    featureId: 0,
                    services: [
                        {
                            serviceId: 0,
                            url: '/featureFlags',
                            name: 'Feature Flag Service',
                            data: {
                                'some.feature.flag': true
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

var appData;
var locker;
new FileLocker().then(fileLocker => {
    locker = fileLocker;
    locker.loadFile(
        '/appData',
        function(data) {
            appData = JSON.parse(data);
            loadUI();
        },
        function(path) {
            locker.saveFile(path, JSON.stringify(defaultEntries));
        }
    )
});

function saveData() {
    locker.saveFile('/appData', JSON.stringify(appData));
    chrome.runtime.sendMessage(appData);
}