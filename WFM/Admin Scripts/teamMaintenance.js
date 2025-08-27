const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
let fs = require("fs");

describe("Team Maintenance screen", function() {

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

    //Open Team Maintenance screen
    it("Open (Admin) Team Maintenance sub-section", async function() {
        await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.sleep(500);
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(2000);

        //test report
        let verifyText = await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt"))
        .getText().then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "Team Maintenance");
        } catch{
            assert.ifError('Team Maintenance screen is not loaded');
        };

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/teamMaintenance.png', encodedString, 'base64');
        console.log("Team Maintenance screenshot is generated");
    });

    //Add Team
    it("Add Team", async function() {
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Selenium_Test_Team_01");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Business Banking");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //test report
        let verifyText = await driver.findElements(By.name("Selenium_Test_Team_01"))
        .then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "Selenium_Test_Team_01");
        } catch{
            assert.ifError('New team has not been added');
        };
    });

    //Update team
    it("Update Team", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click()
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Defect1");
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__teamName_0")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).clear();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Selenium_Test_Team_02");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("FCO");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //Verify updated team details
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Selenium_Test_Team_02");
        //     await driver.findElement(By.id(Enter id details)).click(); //Open Team Details
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //test report
        let verifyText = await driver.findElements(By.name("Selenium_Test_Team_02"))
        .then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "Selenium_Test_Team_02");
        } catch{
            assert.ifError('Existing team has not been updated');
        };
    });

    //Search team
    it("Search Team", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("test_team_09_05_2023");

        //test report
        let verifyText = await driver.findElement(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__teamName_0_txtcnt")).getText()
        .then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "test_team_09_05_2023");
        } catch{
            assert.ifError('Team Search has failed');
        };
    });

    //Deactivate Team
    it("Deactivate Team", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Team X");
        await driver.findElement(By.id("opsadm__TeamMaintenance__deactivateBtn_0")).click();
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_11")).click(); //YES button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_12")).click(); //NO button

        //test report
        let verifyText = driver.findElement(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__status_0_txtcnt")).getText()
        .then (function (value) {
            return value;
        });
        try{
            assert.strictEqual(verifyText, "Inactive");
        } catch{
            assert.ifError('Existing team has not been deactivated');
        };
    });

    //Create 2 teams with same details (Status - PendingCore)
    it("Create 2 teams with same details (Status - PendingCore)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Team 1Team 2");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Customer Relations");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Duplicate team has been created (Status - PendingCore)');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Create 2 teams with same details (Status - Active)
    it("Create 2 teams with same details (Status - Active)", async function() {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click(); //Task Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("select2-opsadm__TeamTaskMaintenance__teamDrp-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Team 1Team 2Team 3Team 4");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__coreTbl_add_btn")).click(); //Add core activity
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName")).sendKeys("Task_test");
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
        await driver.findElement(By.xpath("//label[@for='opsadm__TeamTaskMaintenance__subTaskCore_selcb_0']")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys("Subtask_test");
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys("10000");
        // await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click(); //SAVE button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click(); //CANCEL button

        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Team 1Team 2Team 3Team 4");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Project");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Duplicate team has been created (Status - PendingCore)');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Create 2 teams with same details (Status - Deactivated)
    it("Create 2 teams with same details (Status - Deactivated)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("check-Test");
        await driver.findElement(By.id("opsadm__TeamMaintenance__deactivateBtn_0")).click();
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_11")).click(); //YES button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_12")).click(); //NO button
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click(Key.CLEAR);

        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("check-Test");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("FCO");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Duplicate team has been created (Status - PendingCore)');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Add Team (without entering 'Team name' textbox value)
    it("Add Team (without entering \'Team name\' textbox value)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Business Banking");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Team has been added without entering \'Team name\' textbox value');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Add Team (without selecting 'Business Area' dropdown option)
    it("Add Team (without selecting \'Business Area\' dropdown option)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Selenium_Test_Team");
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Team has been added without seleting \'Business Area\' dropdown option');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Add Team (without entering 'Team name' textbox value and without selecting 'Business Area' dropdown option)
    it("Add Team (without entering \'Team name\' textbox value and without selecting \'Business Area\' dropdown option)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Team has been added without seleting \'Business Area\' dropdown option');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button
    });

    //Update Team (without entering 'Team name' textbox value)
    it("Update Team (without entering \'Team name\' textbox value)", async function() {
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click()
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Akash - Test@123");
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__teamName_0")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).clear();
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("FCO");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button

        //test report
        if(driver.findElement(By.className("ok")).isDisplayed()){
            assert.ok(true);
        } else{
            assert.ifError('Team has been updated without entering \'Team name\' textbox value');
        };

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        await driver.quit(); //Close browser
    });

});