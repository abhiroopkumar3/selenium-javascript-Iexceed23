const {By,Key,Builder, Options, Capabilities, WebDriver} = require("selenium-webdriver");
require("geckodriver");
require("chromedriver");
require("edgedriver")
const assert = require("assert");

describe("browserTest", function() {
/* 
    //Launch Chrome browser in incognito mode
    var webdriver = require('selenium-webdriver');
    var chromeCapabilities = webdriver.Capabilities.chrome();
    var chromeOptions = {'args': ['--test-type', '---incognito']};
    chromeCapabilities.set("goog:chromeOptions", chromeOptions);
    var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
 */
/* 
    //Launch Edge browser in incognito mode
    var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
            args: ['-inprivate']
        }
    }
    let driver = new Builder().withCapabilities(edgeOptions).build();
 */
/* 
    //Launch Firefox browser in incognito mode
    let caps = { browserName: 'firefox', 'moz:firefoxOptions': {
          args: ['-private']
        }
    };
    let driver = new Builder().withCapabilities(caps).build();
 */

    //Launch Edge browser in incognito mode
    var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
            args: ['-IE mode']
        }
    }
    let driver = new Builder().withCapabilities(edgeOptions).build();

    it("googlesearch1", async function() {

        // let driver = await new Builder().forBrowser('chrome').build(); // Launch Chrome browser

        let driver = await new Builder().forBrowser('MicrosoftEdge').build(); //Launch Edge browser

        // let driver = await new Builder().forBrowser('firefox').build(); // Launch Firefox browser

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