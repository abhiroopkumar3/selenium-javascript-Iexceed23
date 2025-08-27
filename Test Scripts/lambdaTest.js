const {By,Key,Builder} = require("selenium-webdriver");
const ltCapabilities = require("../capabilities");
const assert = require("assert");

describe("lambdatest", function() {

    var driver;

    const USERNAME = ltCapabilities.capabilities.user;
    const KEY = ltCapabilities.capabilities.ACCESSKEY;
    const GRID_HOST = "hub.lambdatest.com/wd/hub";
    const gridUrl = "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;

    const URL = "https://www.google.com/";

    beforeEach(function(){
        // let driver = await new Builder().forBrowser('firefox').build();
        ltCapabilities.capabilities.name = this.currentTest.title;
        driver = new Builder().usingServer(gridUrl).withCapabilities(ltCapabilities.capabilities).build();
    });

    afterEach(async function(){
        await driver.quit();
    });

    it("googlesearch1", async function() {

        await driver.manage().setTimeouts({implicit:10000});
        await driver.get(URL);
        await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript");
        await driver.findElement(By.xpath("(//input[@name='btnK'])[2]")).click();
            
        let verifyText = await driver.findElement(By.xpath("//h3[text()='Automation Testing with Selenium JavaScript [Tutorial]']"))
        .getText()
        .then (function (value) {
            return value;
        });

        assert.strictEqual(verifyText, "Automation Testing with Selenium JavaScript [Tutorial]");
    });

    it("googlesearch2", async function() {

        await driver.manage().setTimeouts({implicit:10000});
        await driver.get(URL);
        await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript");
        await driver.findElement(By.xpath("(//input[@name='btnK'])[2]")).click();
            
        let verifyText = await driver.findElement(By.xpath("//h3[text()='Selenium JavaScript Automation Testing Tutorial For Beginners']"))
        .getText()
        .then (function (value) {
            return value;
        });

        assert.strictEqual(verifyText, "Selenium JavaScript Automation Testing Tutorial For Beginners");
    });

});