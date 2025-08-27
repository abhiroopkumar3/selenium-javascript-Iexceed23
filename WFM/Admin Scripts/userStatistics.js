const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
let fs = require("fs");

describe("User Statistics screen", function() {

    const URL = "https://tsbapps.appzillon.com/WFMSSO/"; //Public access URL
    // const URL = "https://apps.appzillon.com/WFMSSO/"; //i-exceed VPN should be connected;

    let driver = new Builder().forBrowser('MicrosoftEdge').build(); //Launch browser

    //MICROSOFT LOGIN (SSO)
    it("MICROSOFT LOGIN (SSO)", async function() {
        await driver.manage().setTimeouts({implicit:10000});
        await driver.manage().window().maximize();
        await driver.get(URL); //Launch WFM app
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();
        await driver.sleep(15000);

        //test report
        let verifyText = await driver.getTitle()
        .then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "WFMApp");
        } catch {
            assert.ifError('MS Login has failed');
        };
    });

    //Open User Statistics screen
    it("Open (Admin) User Statistics sub-section", async function() {
        await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.sleep(500);
        const element = await driver.findElement(By.id("sidebar"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("lndapp__Landing__userStatistics_txtcnt")).click()
        await driver.sleep(2000);

        //test report
        let verifyText = await driver.findElement(By.id("lndapp__Landing__userStatistics_txtcnt"))
        .getText().then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "User Statistics");
        } catch{
            assert.ifError('User Statistics screen is not loaded');
        };

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics.png', encodedString, 'base64');
        console.log("User Statistics screenshot is generated");
    });

    //Verify Count details
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_1_span_")).click(); //Count radio button
        await driver.findElement(By.id("btn_icon_icon-refresh")).click() //Refresh button

        //test report
        let verifyText = await driver.findElement(By.id("opsadm__UserStatistics__el_txt_5_txtcnt"))
        .getText().then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "USER STATISTICS - CURRENT DATE");
        } catch{
            assert.ifError('Count details are not verfied');
        };
    });

    //Verify Email ID details - Appointment Booking
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("Appointment Booking");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys("abhiroop.kumar@i-exceed.com");
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).clear();

        //test report
        if (driver.findElement(By.id("opsadm__GetLoginUserEmailsDB__o__opsadm__GetLoginUserEmailsDB_Res__FIRSTNAME_0_txtcnt"))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))){
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - Appointment Booking are not verfied');
        }
    });

    //Verify Email ID details - WFM Ops
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("WFM Ops");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys("abhiroop.kumar@i-exceed.com");
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).clear();

        //test report
        if (driver.findElement(By.id("opsadm__GetLoginUserEmailsDB__o__opsadm__GetLoginUserEmailsDB_Res__FIRSTNAME_0_txtcnt"))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))){
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - WFM Ops are not verfied');
        }
    });

    //Verify Email ID details - WFM Branch
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("WFM Branch");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys("abhiroop.kumar@i-exceed.com");
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).clear();

        //test report
        if (driver.findElement(By.id("opsadm__GetLoginUserEmailsDB__o__opsadm__GetLoginUserEmailsDB_Res__FIRSTNAME_0_txtcnt"))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))){
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - WFM Branch are not verfied');
        }
    });

    //Verify Email ID details - Leads
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("Leads");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys("abhiroop.kumar@i-exceed.com");
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).clear();

        //test report
        if (driver.findElement(By.id("opsadm__GetLoginUserEmailsDB__o__opsadm__GetLoginUserEmailsDB_Res__FIRSTNAME_0_txtcnt"))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))){
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - Leads are not verfied');
        }
    });

    //Verify Email ID details - CSS
    it("Verify Count details", async function() {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("CSS");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys("abhiroop.kumar@i-exceed.com");
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).clear();

        //test report
        if (driver.findElement(By.id("opsadm__GetLoginUserEmailsDB__o__opsadm__GetLoginUserEmailsDB_Res__FIRSTNAME_0_txtcnt"))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))){
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - CSS are not verfied');
        }

        await driver.quit(); //Close browser
    });

});