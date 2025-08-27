const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");

describe("dyndataTest1", function() {

    const URL = "https://www.google.com/";

    const colors = ["blue", "green","red"];

    colors.forEach((googlesearch) => {
        it(`googlesearch1 for search key - ${googlesearch}`, async function() {

            let driver = await new Builder().forBrowser('MicrosoftEdge').build();

            await driver.manage().setTimeouts({implicit:10000});
            await driver.get(URL);
            await driver.findElement(By.name("q")).sendKeys(googlesearch, Key.RETURN);

            await driver.findElement(By.id("APjFqb")).clear();
            await driver.findElement(By.id("APjFqb")).sendKeys(googlesearch, Key.RETURN);
                            
            let verifyText = await driver.getTitle().then (function (value) {
                return value;
            });
            console.log(verifyText);
            assert.strictEqual(verifyText, googlesearch + " - Google Search");

            await driver.quit();
        });
    });

});