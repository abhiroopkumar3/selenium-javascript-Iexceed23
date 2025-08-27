const {By,Key,Builder, Options, Capabilities, WebDriver} = require("selenium-webdriver");
require("geckodriver");
require("chromedriver");
require("edgedriver")
const assert = require("assert");

describe("headlessTest", function() {

    //Launch Chrome browser in headless mode
    var webdriver = require('selenium-webdriver');
    var chromeCapabilities = webdriver.Capabilities.chrome();
    var chromeOptions = {'args': ['--test-type', '---headless']};
    chromeCapabilities.set("goog:chromeOptions", chromeOptions);
    var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();

/* 
    //Launch Edge browser in headless mode
    var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
            args: ['-headless']
        }
    }
    let driver = new Builder().withCapabilities(edgeOptions).build();
 */
/* 
    //Launch Firefox browser in headless mode
    let caps = { browserName: 'firefox', 'moz:firefoxOptions': {
          args: ['-headless']
        }
    };
    let driver = new Builder().withCapabilities(caps).build();
 */
    it("googlesearch1", async function() {
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.get('https://www.google.com/');
        await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript", Key.ENTER);
        
        //assert - store actual value
        let verifyText = await driver.findElement(By.css("div#rso>div:nth-of-type(3)>div>div>div>div>a>h3"))
        .getText()
        .then (function (value) {
            return value;
        });

        //assert function
        assert.strictEqual(verifyText, "Automation Testing with Selenium JavaScript [Tutorial]");

        await driver.quit();
    });
});