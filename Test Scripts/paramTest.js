const {By,Key,Builder} = require("selenium-webdriver");
const ltCapabilities = require("../Test Scripts/capabilities");
const assert = require("assert");

describe("paramTest", function() {

    var driver;

    const USERNAME = ltCapabilities.capabilities.user;
    const KEY = ltCapabilities.capabilities.ACCESSKEY;
    const GRID_HOST = "hub.lambdatest.com/wd/hub";
    const gridUrl = "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;

    const URL = "https://www.google.com/";
/* 
    beforeEach(function(){
        // let driver = await new Builder().forBrowser('firefox').build();
        ltCapabilities.capabilities.name = this.currentTest.title;
        driver = new Builder().usingServer(gridUrl).withCapabilities(ltCapabilities.capabilities).build();
    });

    afterEach(async function(){
        await driver.quit();
    });
 */
    browsers = [
        { browser: "Chrome", bVersion: "93.0", os: "Windows 10" },
        { browser: "Firefox", bVersion: "91.0", os: "windows 10" }
    ];

    browsers.forEach((browser, bVersion, os) => {
        it(`googlesearch for browser ${browser}, ${bVersion}, ${os}`, async function() {

            ltCapabilities.capabilities.platformName = os
            ltCapabilities.capabilities.browserName = browser
            ltCapabilities.capabilities.browserVersion = bVersion


            ltCapabilities.capabilities.name = this.test.title;
            driver = new Builder().usingServer(gridUrl).withCapabilities(ltCapabilities.capabilities).build();

            await driver.manage().setTimeouts({implicit:10000});
            await driver.get(URL);
            await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript");
            await driver.findElement(By.xpath("(//input[@name='btnK'])[2]")).click();
                
            let verifyText = await driver.findElement(By.xpath("//h3[text()='Automation Testing with Selenium JavaScript [Tutorial]']")).getText().then (function (value) {
                return value;
            });

            assert.strictEqual(verifyText, "Automation Testing with Selenium JavaScript [Tutorial]");

            await driver.quit();
        });
    });

});