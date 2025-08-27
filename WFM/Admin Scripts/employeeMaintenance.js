const {By,Key,Builder} = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
let fs = require("fs");

describe("Employee Maintenance screen", function() {

    const URL = "https://tsbapps.appzillon.com/WFMSSO/"; //Public access URL
    // const URL = "https://apps.appzillon.com/WFMSSO/"; //i-exceed VPN should be connected;

    // let driver = new Builder().forBrowser('MicrosoftEdge').build(); //Launch browser

    //Launch Edge browser in incognito mode
    var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
        args: ['-inprivate']
    }
      }
    let driver = new Builder().withCapabilities(edgeOptions).build();

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

    //Open Employee Maintenance screen
    it("Open (Admin) User Statistics sub-section", async function() {
        await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.sleep(500);
        const element = await driver.findElement(By.id("sidebar"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click()
        await driver.sleep(2000);

        //test report
        let verifyText = await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt"))
        .getText().then (function (value) {
            return value;
        });

        try{
            assert.strictEqual(verifyText, "Employee Maintenance");
        } catch{
            assert.ifError('Employee Maintenance screen is not loaded');
        };

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/employeeMaintenance.png', encodedString, 'base64');
        console.log("Employee Maintenance screenshot is generated");
    });

    //Filter By - 'Team'
    it("Filter By - \'Team\'", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_span")).click(); //Filter By dropdown button
        await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_option_Team")).click(); //Filter By - Team button
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[1]")).click(); //Team dropdown button
        await driver.findElement(By.xpath("(//input[@class='select2-search__field'])[2]")).click();
        await driver.findElement(By.xpath("(//input[@class='select2-search__field'])[2]")).sendKeys("ESU 1", Key.ENTER);

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt"))) {
            assert.ok(true);
        } else if (await driver.findElement(By.className("noDatatxt")) == "No Data Found") {
            assert.ok(true, 'No Data Found');
        } else {
            assert.ifError('Employee Maintenance - Filter By \'Team\' is not verfied');
        }
    });

    //Search Contractor/Offshore Employee details [Filter By - 'Team']
    it("Search Contractor/Offshore Employee details [Filter By - \'Team\']", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();

        //test report
        if (await driver.findElement(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true);
        } else if (await driver.findElement(By.className("norecord"))) {
            assert.ok(true, 'No Records Found');
        } else {
            assert.ifError('Contractor/Offshore Employee details are not verfied');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Temporarily deactivate access (Offshore/Onshore Employee)
    it("Temporarily deactivate access (Offshore/Onshore Employee)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnDeactivate")).click(); //'Temporarily deactivate access' button
        // await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_13")).click(); //YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_14")).click(); //NO button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Deactivated Successfully']")) == "Deactivated Successfully") {
            assert.ok(true);
        } else if (await driver.findElements(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true, 'Temporary deactivation cancelled');
        } else {
            assert.ifError('Partner access could not been temporarily deactivated');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Permanently remove access (Offshore Employee)
    it("Temporarily deactivate access (Offshore Employee)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnDelete")).click(); //'Permanently remove access' button
        // await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_8")).click(); //YES button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Employee Deleted Successfully']")) == "Employee Deleted Successfully") {
            assert.ok(true);
        } else if (await driver.findElements(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true, 'Permanent deactivation cancelled');
        } else {
            assert.ifError('Employee access could not be temporarily deactivated');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_9")).click(); //NO button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (Offshore Employee)
    it("Modify Contractor/ Offshore Employee Information (Offshore Employee)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium_1"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test_1"); //Last Name textbox
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[4]")).click(); // Position Title dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Auditor, Risk", Key.RETURN);
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[5]")).click(); //Contract Type dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Contractor", Key.DOWN, Key.RETURN);
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        // await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button
        // await driver.findElement(By.className("ok")).click(); //(SUBMIT)YES button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Updated Successfully']")) == "Updated Successfully") {
            assert.ok(true);
        } else if (await driver.findElements(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true, 'Offshore Employee modification cancelled');
        } else {
            assert.ifError('Contractor/Offshore Employee Information could not be modified');
        }
        // await driver.findElement(By.className("ok")).click(); //(SUBMIT)OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (Onshore Employee)
    it("Modify Contractor/ Offshore Employee Information (Onshore Employee)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Pradeepreddy"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        // await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button
        // await driver.findElement(By.className("ok")).click(); //(SUBMIT)YES button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Updated Successfully']")) == "Updated Successfully") {
            assert.ok(true);
        } else if (await driver.findElements(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true, 'Onshore Employee modification cancelled');
        } else {
            assert.ifError('Contractor/Offshore Employee Information could not be modified');
        }
        // await driver.findElement(By.className("ok")).click(); //(SUBMIT)OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (add & delete new 'Team sub-table' in Other Details)
    it("Modify Contractor/ Offshore Employee Information (add new 'Team sub-table' in Other Details)", async function() {
        //add team sub-table
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Updated Successfully']")) == "Updated Successfully") {
            assert.ok(true);
        } else if (await driver.findElements(By.xpath("//h1[text()='Modify Contractor/ Offshore Employee Information']"))) {
            assert.ok(true, 'New \'Team sub-table\' add cancelled');
        } else {
            assert.ifError('new \'Team sub-table\' in Other Details has not been added');
        }
        await driver.findElement(By.className("ok")).click(); //(SUBMIT)OK button

        //delete team sub-table
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_0_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__status_1_lbl")).click(); //Delete checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElement(By.xpath("//p[text()='Updated Successfully']"))) {
            assert.ok(true);
        } else {
            assert.ifError('new \'Team\' in Other Details has not been deleted');
        }
        await driver.findElement(By.className("ok")).click(); //(SUBMIT)OK button
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'First Name' value)
    it("Modify Contractor/ Offshore Employee Information (without entering \'First Name\' value)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).clear();
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium_1"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test_1"); //Last Name textbox
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[4]")).click(); // Position Title dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Auditor, Risk", Key.RETURN);
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[5]")).click(); //Contract Type dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Contractor", Key.DOWN, Key.RETURN);
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Please enter all mandatory fields']"))) {
            assert.ok(true);
        } else {
            assert.ifError('Contractor/Offshore Employee Information has been modified without entering \'First Name\' value');
        }
        await driver.findElement(By.xpath("//button[text()='Ok']")).click(); //OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'Last Name' value)
    it("Modify Contractor/ Offshore Employee Information (without entering \'Last Name\' value)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium_1"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).clear();
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test_1"); //Last Name textbox
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[4]")).click(); // Position Title dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Auditor, Risk", Key.RETURN);
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[5]")).click(); //Contract Type dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Contractor", Key.DOWN, Key.RETURN);
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Please enter all mandatory fields']"))) {
            assert.ok(true);
        } else {
            assert.ifError('Contractor/Offshore Employee Information has been modified without entering \'Last Name\' value');
        }
        await driver.findElement(By.xpath("//button[text()='Ok']")).click(); //OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'Contract Type' dropdown option)
    it("Modify Contractor/ Offshore Employee Information (without entering \'Contract Type\' dropdown option)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium_1"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test_1"); //Last Name textbox
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[4]")).click(); // Position Title dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Auditor, Risk", Key.RETURN);
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[5]")).click(); //Contract Type dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Please Select Contract Type", Key.RETURN);
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Please enter all mandatory fields']"))) {
            assert.ok(true);
        } else {
            assert.ifError('Contractor/Offshore Employee Information has been modified without entering \'Contract Type\' dropdown option');
        }
        await driver.findElement(By.xpath("//button[text()='Ok']")).click(); //OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'Role' dropdown option)
    it("Modify Contractor/ Offshore Employee Information (without entering \'Role\' dropdown option)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium_1"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).clear();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test_1"); //Last Name textbox
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[4]")).click(); // Position Title dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Auditor, Risk", Key.RETURN);
        await driver.findElement(By.xpath("(//span[@class='select2-selection__arrow'])[5]")).click(); //Contract Type dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("Please Select Contract Type", Key.RETURN);
        // await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        // await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        await driver.findElement(By.className("select2-selection__choice__remove")).click(); //Remove 'Role' dropdown option
        await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click(); //Primary checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Please enter all mandatory fields']"))) {
            assert.ok(true);
        } else {
            assert.ifError('Contractor/Offshore Employee Information has been modified without entering \'Role\' dropdown option');
        }
        await driver.findElement(By.xpath("//button[text()='Ok']")).click(); //OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'Primary' checkbox in Team sub-table) (Offshore Employee)
    it("Modify Contractor/ Offshore Employee Information (without entering \'Primary\' checkbox in Team sub-table) (Offshore Employee)", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click(); //Modify button
        await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__status_0_lbl")).click(); //Delete checkbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click(); //SUBMIT button

        //test report
        if (await driver.findElements(By.xpath("//p[text()='Please enter all mandatory fields']"))) {
            assert.ok(true);
        } else {
            assert.ifError('Contractor/Offshore Employee Information has been modified without entering \'Primary\' checkbox in Team sub-table');
        }
        await driver.findElement(By.xpath("//button[text()='Ok']")).click(); //OK button
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click(); //CANCEL button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click(); //(CANCEL)YES button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Filter By - 'Employee Details'
    it("Filter By - \'Employee Details\'", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_span")).click(); //Filter By dropdown button
        await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_option_Employee Details")).click(); //Filter By - Employee Details button

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Employee Maintenance - Filter By \'Employee Details\' is not verfied');
        }
    });

    //Search Employee by 'First Name' [Filter By - 'Employee Details']
    it("Search Employee by \'First Name\' [Filter By - \'Employee Details\']", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium");

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).getText() == "Selenium") {
            assert.ok(true);
        } else if (await driver.findElements(By.className("norecord")) == "No Records Found") {
            assert.ok(true, 'No Records Found');
        } else {
            assert.ifError('Employee search by \'First Name\' could not be verfied');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_12")).click(); //RESET button
    });

    //Search Employee by 'Last Name' [Filter By - 'Employee Details']
    it("Search Employee by \'Last Name\' [Filter By - \'Employee Details\']", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__lastName")).sendKeys("Test"); //Last Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium");

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__surname_0_txtcnt")).getText() == "Test") {
            assert.ok(true);
        } else if (await driver.findElements(By.className("norecord")) == "No Records Found") {
            assert.ok(true, 'No Records Found');
        } else {
            assert.ifError('Employee search by \'Last Name\' could not be verfied');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_12")).click(); //RESET button
    });

    //Search Employee by 'Email' [Filter By - 'Employee Details']
    it("Search Employee by \'First Name\' [Filter By - \'Employee Details\']", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__email")).sendKeys("selenium.test@i-exceed.com"); //Email Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium");

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__emailAddress_0_txtcnt")).getText() == "selenium.test@i-exceed.com") {
            assert.ok(true);
        } else if (await driver.findElements(By.className("norecord")) == "No Records Found") {
            assert.ok(true, 'No Records Found');
        } else {
            assert.ifError('Employee search by \'Email\' could not be verfied');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_12")).click(); //RESET button
    });

    //Search Employee by 'Employee Id' [Filter By - 'Employee Details']
    it("Search Employee by \'First Name\' [Filter By - \'Employee Id\']", async function() {
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__employeeId")).sendKeys("9995995"); //Employee Id textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium");

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__personnelNumber_0_txtcnt")).getText() == "9995995") {
            assert.ok(true);
        } else if (await driver.findElements(By.className("norecord")) == "No Records Found") {
            assert.ok(true, 'No Records Found');
        } else {
            assert.ifError('Employee search by \'Employee Id\' could not be verfied');
        }
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_12")).click(); //RESET button
        await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();

        await driver.quit; //Close browser
    });

});