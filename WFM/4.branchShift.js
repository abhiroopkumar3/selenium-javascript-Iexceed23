const { By, Key, Builder } = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
const fs = require("fs");

//Launch Edge browser in incognito mode
var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
    args: ['-inprivate']
    }
}
let driver = new Builder().withCapabilities(edgeOptions).build();

describe("Branch Shift Screen : ", function () {
    
    var login = require("./Login.json");
    JSON.stringify(login, true) // Load login file

    it("1. Load WFM URL", async function () {
        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.get(login.url);
        await driver.findElement(By.name("loginfmt")).sendKeys(login.User_id);
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.name("passwd")).sendKeys(login.password);
        await driver.findElement(By.xpath("//input[@value='Sign in']")).click();
        await driver.sleep(150000);
        let urlText = await driver.getTitle().then(function (value) {
            return value;
        });
        assert.strictEqual(urlText, 'WFMApp');
    });


    it("2. Open Branch Shift Screen", async function () {
        await driver.sleep(6000);
        await driver.findElement(By.xpath("//span[text()='Branch Shifts']")).click();
        await driver.sleep(6000);
        var sHIFTMAINTENANCE = await driver.findElement(By.xpath("//h4[text()='SHIFT MAINTENANCE']")).getText().then(function (value) {
            return value;
        });
        assert.strictEqual(sHIFTMAINTENANCE, 'SHIFT MAINTENANCE');

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/branchShift.png', encodedString, 'base64');
        console.log("Count details screenshot is generated");
    });

    it("3. Create a Shift without entring Start & End Dates", async function(){
        // await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsMaster__startDt")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id("bshift__NewShift__el_btn_3")).click();
        await driver.findElement(By.className("ok")).click();
        
    });

    it("4. Create a Shift with previous dates", async function(){
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsMaster__startDt")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("(//div[text()='18'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsMaster__endDt")).click();
        await driver.findElement(By.xpath("(//div[text()='18'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("bshift__NewShift__el_btn_3")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("5. Create a Shift", async function(){
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsMaster__startDt")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("(//div[text()='22'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsMaster__endDt")).click();
        await driver.findElement(By.xpath("(//div[text()='23'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__startTime_4")).sendKeys("10:30");
        // await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__startTime_2_option_10:30")).click();
        await driver.findElement(By.id("bshift__NewShift__el_cbx_4_2_lbl")).click();
        await driver.findElement(By.id("bshift__NewShift__el_btn_3")).click();
        await driver.findElement(By.className("ok")).click();
    });



    it("6. Modify a Shift", async function(){
        await driver.findElement(By.id("bshift__UserShiftSummary__editUserShiftBtn_0")).click();
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__startTime_4")).click();
        await driver.sleep(6000);
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__startTime_4")).sendKeys(Key.DOWN,Key.DOWN,Key.DOWN,Key.DOWN,Key.ENTER);
        await driver.sleep(6000);
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__endTime_4")).click();
        await driver.sleep(6000);
        await driver.findElement(By.id("bshift__UserShiftDM__i__tbWfmUserHrsDetail__endTime_4")).sendKeys(Key.DOWN,Key.DOWN,Key.DOWN,Key.DOWN,Key.ENTER);
        await driver.findElement(By.id("bshift__NewShift__el_cbx_4_4_lbl")).click();
        await driver.findElement(By.id("bshift__NewShift__el_btn_3")).click();
        await driver.findElement(By.className("ok")).click();
    });
    
});