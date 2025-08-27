const {By,Key,Builder} = require("selenium-webdriver");
require("geckodriver");
const {Console} = require("console");
const fs = require("fs");

//Make a new logger
const myConsole = new Console({
        stdout: fs.createWriteStream("(admin_TM)console-log.txt"), //write stream
        stderr: fs.createWriteStream("(admin_TM)error-log.txt"), //write stream
        });

async function Team_Maintenance(){

//Declare variables
        var testCaseArray = new Array();
        var status;
        var data = 'TEST CASE ID'+'\t'+'TEST CASE DESCRIPTION'+'\t'+'TEST CASE TYPE'+'\t'+'STATUS'+'\n'; //Excel file heading

//Launch browser in incognito mode
    // var webdriver = require('selenium-webdriver');
    // var chromeCapabilities = webdriver.Capabilities.chrome();
    // var chromeOptions = {'args': ['--test-type', '---incognito']};
    // chromeCapabilities.set("goog:chromeOptions", chromeOptions);
    // var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();

//Launch browser
        let driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({implicit:10000});
        console.log("\n","\n" + "WFM TEST CASES","\n"); //Console heading

        //Launch WFM app
        await driver.get("https://tsbapps.appzillon.com/WFMSSO/"); //Public access URL
        // await driver.get("https://apps.appzillon.com/WFMSSO/"); //i-exceed VPN should be connected

//MICROSOFT LOGIN (SSO)
        await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();
        await driver.sleep(15000);

        //test report
        try{
                let expectedHeading = 'WFMApp';
                let heading = await driver.getTitle();
                if(expectedHeading == heading) {
                        status = "PASS";
                        console.log('Microsoft Login (SSO): PASS [POSITIVE]');
                }else {
                        status = "FAIL";
                        console.log('Microsoft Login (SSO): FAIL [POSITIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'Microsoft Login (SSO)',
                        'TEST_CASE_DESCRIPTION':'Microsoft Login with SSO (MFA)',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                        });
        }catch(err) {
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

//Open (Admin) Team Maintenance sub-section
        await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();

        //test report
        try{
                let expectedHeading = 'Team Maintenance';
                let heading = await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).getText();
                if(expectedHeading == heading) {
                        status = "PASS";
                        console.log('Open (Admin) Team Maintenance sub-section: PASS [POSITIVE]');
                }else {
                        status = "FAIL";
                        console.log('Open (Admin) Team Maintenance sub-section: FAIL [POSITIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC001',
                        'TEST_CASE_DESCRIPTION':'Open (Admin) Team Maintenance sub-section',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                });
        }catch(err) {
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

//Add Team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Selenium_Test_Team");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Business Banking");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        //     await driver.sleep(500);
        //     await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //Verfiy new team details
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Selenium_Test_Team_01");
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear(); //Clear searchbox
        //     await driver.findElement(By.id(Enter id details)).click(); //Open Team Details
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //test report

        try{
                let expectedHeading = 'Selenium_Test_Team_01';
                const heading = await driver.findElements(By.name("Selenium_Test_Team_01"));
                if (expectedHeading == heading) {
                        status = "PASS";
                        console.log('Add Team: PASS [POSITIVE]');
                } else if (heading.length == 0) {
                        status = "FAIL";
                        console.log('Add Team: FAIL [POSITIVE]');
                } else {
                        status = "FAIL";
                        console.log('Add Team: FAIL');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC002',
                        'TEST_CASE_DESCRIPTION':'Add Team',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

//Update team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
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
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Selenium_Test_Team_02");
        //     await driver.findElement(By.id(Enter id details)).click(); //Open Team Details
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

        //test report
        try{
                let expectedHeading = 'Selenium_Test_Team_02';
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Selenium_Test_Team_02");
                const heading = await driver.findElements(By.name("Selenium_Test_Team_02"));
                if (expectedHeading == heading) {
                        status = "PASS";
                        console.log('Update team: PASS [POSITIVE]');
                } else if (heading.length == 0) {
                        status = "FAIL";
                        console.log('Update team: FAIL [POSITIVE]');
                } else if (expectedHeading != heading) {
                        status = "FAIL";
                        console.log('Update team: FAIL [POSITIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC003',
                        'TEST_CASE_DESCRIPTION':'Update team',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                });
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear();
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

//Search team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("test_team_09_05_2023");

        //test report
        try{
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("test_team_09_05_2023");
                if (await driver.findElements(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__teamName_0_txtcnt"))) {
                        status = "PASS";
                        console.log('Search team: PASS [POSITIVE]');
                }else {
                        status = "FAIL";
                        console.log('Search team: FAIL [POSITIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC004',
                        'TEST_CASE_DESCRIPTION':'Search team',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                });
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear();
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear();

//Deactivate team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Team 1Team 2");
        await driver.findElement(By.id("opsadm__TeamMaintenance__deactivateBtn_2")).click();
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_11")).click(); //YES button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_12")).click(); //NO button

        //test report
        try{
                let expectedHeading = 'Inactive';
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Team 1Team 2");
                const heading = await driver.findElements(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__status_2"));
                if (expectedHeading == heading) {
                        status = "PASS";
                        console.log('Deactivate team: PASS [POSITIVE]');
                } else if (heading.length == 0) {
                        status = "FAIL";
                        console.log('Deactivate team: FAIL [POSITIVE]');
                } else if (expectedHeading != heading) {
                        status = "FAIL";
                        console.log('Deactivate team: FAIL [POSITIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC005',
                        'TEST_CASE_DESCRIPTION':'Deactivate team',
                        'TEST_CASE_TYPE':'POSITIVE',
                        'STATUS':status,
                });
                await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear();
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

//Create 2 teams with same details

        //Create 2nd team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Team 1Team 2");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Customer Relations");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed()) {
                        status = "PASS";
                        console.log('Create 2 teams with same details: PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Create 2 teams with same details: FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC006',
                        'TEST_CASE_DESCRIPTION':'Create 2 teams with same details',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Create 2 teams with same details (Status – PendingCore)

        //Create 2nd team (Status of existing team is 'PendingCore' by default)
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Team 1Team 2");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Customer Relations");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed) {
                        status = "PASS";
                        console.log('Create 2 teams with same details (Status - PendingCore): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Create 2 teams with same details (Status - PendingCore): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC007',
                        'TEST_CASE_DESCRIPTION':'Create 2 teams with same details (Status - PendingCore)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Create 2 teams with same details (Status – Active)

        //Change Status to 'Active' (existing team)
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click(); //Task Maintenance screen
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

        //Create 2nd team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Team 1Team 2Team 3Team 4");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Project");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed) {
                        status = "PASS";
                        console.log('Create 2 teams with same details (Status - Active): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Create 2 teams with same details (Status - Active): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC008',
                        'TEST_CASE_DESCRIPTION':'Create 2 teams with same details (Status - Active)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Create 2 teams with same details (Status – Deactivated)

        //Deactivate any existing team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("check-Test");
        await driver.findElement(By.id("opsadm__TeamMaintenance__deactivateBtn_0")).click();
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_11")).click(); //YES button
        // await driver.sleep(500);
        // await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_12")).click(); //NO button
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).clear();

        //Create 2nd team
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("check-Test");
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("FCO");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed) {
                        status = "PASS";
                        console.log('Create 2 teams with same details (Status - Deactivated): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Create 2 teams with same details (Status - Deactivated): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC009',
                        'TEST_CASE_DESCRIPTION':'Create 2 teams with same details (Status - Deactivated)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Add Team (without entering 'Team name' textbox value)
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Payment Ops");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed()) {
                        status = "PASS";
                        console.log('Add Team (without entering \'Team name\' textbox value): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Add Team (without entering \'Team name\' textbox value): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC010',
                        'TEST_CASE_DESCRIPTION':'Add Team (without entering \'Team name\' textbox value)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }

        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Add Team (without selecting 'Business Area' dropdown option)
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys("Selenium_Test_Team");
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed()) {
                        status = "PASS";
                        console.log('Add Team (without selecting \'Business Area\' dropdown option): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Add Team (without selecting \'Business Area\' dropdown option): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC011',
                        'TEST_CASE_DESCRIPTION':'Add Team (without selecting \'Business Area\' dropdown option)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Add Team (without entering 'Team name' textbox value and without selecting 'Business Area' dropdown option)
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed()) {
                        status = "PASS";
                        console.log('Add Team (without entering \'Team name\' textbox value and without selecting \'Business Area\' dropdown option): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Add Team (without entering \'Team name\' textbox value and without selecting \'Business Area\' dropdown option): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC012',
                        'TEST_CASE_DESCRIPTION':'Add Team (without entering \'Team name\' textbox value and without selecting \'Business Area\' dropdown option)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Update Team (without entering 'Team name' textbox value)
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click(); //Team Maintenance screen
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys("Akash - Test@123");
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__o__tbWfmTeamDetails__teamName_0")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).clear();
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("FCO");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click(); //SUBMIT button
        // await driver.sleep(500);

        //test report
        try{
                if (driver.findElement(By.className("ok")).isDisplayed()) {
                        status = "PASS";
                        console.log('Update Team (without entering \'Team name\' textbox value): PASS [NEGATIVE]');
                } else {
                        status = "FAIL";
                        console.log('Update Team (without entering \'Team name\' textbox value): FAIL [NEGATIVE]');
                }
                testCaseArray.push({
                        'TEST_CASE_ID':'WFM_Admin_TM_TC013',
                        'TEST_CASE_DESCRIPTION':'Update Team (without entering \'Team name\' textbox value)',
                        'TEST_CASE_TYPE':'NEGATIVE',
                        'STATUS':status,
                });
        }catch(err){
                console.log('Test failed with reason = ' + err);
                myConsole.error('Test failed with reason = ' + err);
        }
        await driver.findElement(By.className("ok")).click(); //OK button
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click(); //CANCEL button

//Add data to log file
        myConsole.log("WFM TEST CASES","\n"); //log file heading
        myConsole.log(testCaseArray);

//Generate Excel file
        fs.truncate('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/WFM/Old Scripts', 0, function(){console.log('')}) //filepath
        for (var i = 0; i < testCaseArray.length; i++) {
            data = data + testCaseArray[i].TEST_CASE_ID + '\t' + testCaseArray[i].TEST_CASE_DESCRIPTION + '\t' + testCaseArray[i].TEST_CASE_TYPE + '\t' + testCaseArray[i].STATUS + '\n';
        }

        //Delete old excel file
        fs.unlink('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/WFM/Old Scripts/' + '(admin_TM)test-report.xlsx', (err) => {
            if (err) throw err;
            console.log("(Old excel report is deleted)");
        });

        fs.appendFile('(admin_TM)test-report.xlsx', data, (err) => {
            if (err) throw err;
            console.log('\n' + 'Excel report is generated');
        });

//Close browser
        await driver.quit();

};

Team_Maintenance();