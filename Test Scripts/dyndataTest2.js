const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");

const colors = [
    { googlesearch1:"blue", googlesearch2:"green", googlesearch3:"red" },
    { googlesearch1:"sky_blue", googlesearch2:"forest_green", googlesearch3:"brick_red" }
];

describe("dyndataTest2", function() {

    const URL = "https://www.google.com/";

    colors.forEach(({googlesearch1, googlesearch2, googlesearch3}) => {
        it(`googlesearch for search key - ${googlesearch1},${googlesearch2},${googlesearch3}`, async function() {

            let driver = await new Builder().forBrowser('MicrosoftEdge').build();

            await driver.manage().setTimeouts({implicit:10000});
            await driver.get(URL);
            await driver.sleep(2000);

            await driver.findElement(By.name("q")).sendKeys(googlesearch1, Key.RETURN);
            await driver.findElement(By.id("APjFqb")).clear();

            await driver.findElement(By.id("APjFqb")).sendKeys(googlesearch2, Key.RETURN);
            await driver.findElement(By.id("APjFqb")).clear();

            await driver.findElement(By.id("APjFqb")).sendKeys(googlesearch3, Key.RETURN)

            let verifyText =  await driver.getTitle().then (function (value) {
                return value;
            });
            console.log(verifyText);
            debugger;
            assert.strictEqual(verifyText, googlesearch3 + " - Google Search");

            await driver.quit();

        });
    });

});