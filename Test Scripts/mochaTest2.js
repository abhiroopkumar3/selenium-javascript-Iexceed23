const {By,Key,Builder} = require("selenium-webdriver");
require("geckodriver");
const assert = require("assert");

describe("testmocha2", function() {
    it("googlesearch2", async function() {
        let driver = await new Builder().forBrowser('firefox').build();
        await driver.manage().setTimeouts({implicit:10000});
        await driver.get('https://www.google.com/');
        await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript", Key.ENTER);
        
        //assert - store actual value
        let verifyText = await driver
        .findElement(By.css("div#rso>div:nth-of-type(3)>div>div>div>div>a>h3"))
        .getText()
        .then (function (value) {
            return value;
        });

        //assert function
        assert.strictEqual(verifyText, "Automation Testing with Selenium JavaScript [Tutorial]");

        await driver.quit();
    });
});