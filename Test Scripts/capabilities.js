var capabilities = {
    "browserName": "Firefox",
    "browserVersion": "114.0",
    "LT:Options": {
        "username": "Your LambdaTest Username",
        "accessKey": "Your LambdaTest Access Key",
        "platformName": "Windows 11",
        "resolution": "1920x1080",
        // "headless": true,
        "build": "Test Build",
        "name": "Selenium Test",
        "w3c": true,
        "plugin": "node_js-mocha"
    }
}

module.exports = {
    capabilities
};