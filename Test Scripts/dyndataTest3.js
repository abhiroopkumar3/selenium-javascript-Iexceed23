const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
const data = require("../Test Scripts/dyndata.json");

describe("dyndataTest3", function() {

    const URL = "https://www.google.com/";

    var myData = data.dyndata1;

    beforeEach(function() {
        var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
                args: ['-headless', '-inprivate']
            }
        }
        driver = new Builder().withCapabilities(edgeOptions).build();
    });

    afterEach(async function() {
        await driver.quit();
    })

    myData.forEach((search) => {
        it(`googlesearch for search key - ${search.googlesearch1}, ${search.googlesearch2}, ${search.googlesearch3}`, async function() {

            await driver.manage().setTimeouts({implicit:10000});
            await driver.get(URL);
            await driver.findElement(By.name("q")).sendKeys(search.googlesearch1, Key.RETURN);

            await driver.findElement(By.id("APjFqb")).clear();
            await driver.findElement(By.id("APjFqb")).sendKeys(search.googlesearch2, Key.RETURN);

            await driver.findElement(By.id("APjFqb")).clear();
            await driver.findElement(By.id("APjFqb")).sendKeys(search.googlesearch3, Key.RETURN);
                            
            let verifyText = await driver.getTitle().then (function (value) {
                return value;
            });
            console.log(verifyText);
            assert.strictEqual(verifyText, search.googlesearch3 + " - Google Search");
        });
    });

});