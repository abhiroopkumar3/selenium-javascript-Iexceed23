const {By,Key,Builder} = require("selenium-webdriver");
require("geckodriver");
let fs = require("fs");

(async function googlesearch(){

    let driver = await new Builder().forBrowser('chrome').build();

    await driver.manage().window().maximize();

    await driver.manage().setTimeouts({implicit:10000});
    await driver.get('https://www.google.com/');
    await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript");
    await driver.findElement(By.name("q")).sendKeys(Key.ENTER);

    let encodedString = await driver.takeScreenshot();
    fs.writeFileSync('./image.png', encodedString, 'base64');
    console.log();
    }
    // await driver.quit();
)();

