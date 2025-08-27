const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
let fs = require("fs");

describe("Team Maintenance", function() {

    const URL = "https://tsbapps.appzillon.com/WFMSSO/"; //Public access URL
    // const URL = "https://apps.appzillon.com/WFMSSO/"; //i-exceed VPN should be connected;

    //Launch Edge browser in incognito mode
    var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
        args: ['-inprivate']
    }
      }
    let driver = new Builder().withCapabilities(edgeOptions).build();

    //Microsoft Login (SSO) with correct credentials
    it("Microsoft Login (SSO) with correct credentials", async function() {
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.get(URL); //Launch WFM app
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();
        await driver.sleep(10000);

        //test report
        let verifyText = await driver.getTitle()
        .then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "WFMApp");
        } catch {
            assert.ifError('MS Login (with correct credentials) has failed');
        };

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/WFMApp(msLogin).png', encodedString, 'base64');
        console.log("WFMApp(msLogin) screenshot is generated");
    });

    //Microsoft Login (SSO) with incorrect Email ID
    it("Microsoft Login (SSO) with incorrect Email ID", async function() {
        await driver.switchTo().newWindow('window'); //Open new window
        await driver.get(URL); //Launch WFM app
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@google.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();

        //test report
        if(driver.findElements(By.id("usernameError"))){
            assert.ok(true);
        } else{
            assert.ifError('MS Login (with incorrect email ID) has passed');
        };
    });

    //Microsoft Login (SSO) with incorrect Password
    it("Microsoft Login (SSO) with incorrect Password", async function() {
        await driver.switchTo().newWindow('tab');; //Open new tab
        await driver.get(URL); //Launch WFM app
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.id("i0118")).sendKeys("XYZW"); //Password
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();

        //test report
        if(driver.findElements(By.id("passwordError"))){
            assert.ok(true);
        } else{
            assert.ifError('MS Login (with incorrect password) has passed');
        };
    });

    //Microsoft Login (SSO) with incorrect OTP
    it("Microsoft Login (SSO) with incorrect OTP", async function() {
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.get(URL); //Launch WFM app
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();

        //test report
        if(driver.findElements(By.className("row text-title"))){
            assert.ok(true);
        } else{
            assert.ifError('MS Login (with incorrect OTP) has passed');
        };

        await driver.quit(); //Close browser
    });

});