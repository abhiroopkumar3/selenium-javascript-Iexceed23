const { By, Key, Builder } = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
const fs = require("fs");
var login = require("./Login.json");
//Before every test run, change 'TestSel' to 'TestSel[x+1, (x=1)]' in Data.json
var data = require("./Data.json");
JSON.stringify(login, true) // Load login file
JSON.stringify(data, true)

//Launch Edge browser in incognito mode
var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
    args: ['-inprivate']
    }
}
let driver = new Builder().withCapabilities(edgeOptions).build();

describe("Team Maintenance Screen : ", function () {

    var addTeam = data.Team_Maintenance.Add_Team[0];
    var UpdateTeam = data.Team_Maintenance.Update_Team[0];
    var searchTeam = data.Team_Maintenance.Search_Team[0];

    it("1. Load WFM URL", async function () {
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.get(login.url);
        await driver.findElement(By.name("loginfmt")).sendKeys(login.User_id);
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.name("passwd")).sendKeys(login.password);
        await driver.findElement(By.xpath("//input[@value='Sign in']")).click();
        await driver.sleep(60000);
        let urlText = await driver.getTitle().then(function (value) {
            return value;
        });
        assert.strictEqual(urlText, 'WFMApp');
    //     await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
    });

    it("2. Add a new team", async function () {
        
        await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();
        // Add a new Team
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(addTeam.Team_Name);      // Add New Team Name
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(addTeam.Bussiness_Area);    // Add New Bussiness Area
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();		//Cancel
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();		   //Submit
        // if ( await driver.findElement(By.className("msg")).isEnabled()) {
        // await driver.findElement(By.className("ok")).click();
        // await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys(addTeam.Team_Name);  //search for added team
        // await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        // await driver.findElement(By.xpath("//span[text()="+addTeam.Team_Name+"]")).click(); //open new team
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();   //cancel
        // }
    });

    it("3. Update details of an existing team", async function () {

        // Update Team
        
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()="+"'"+UpdateTeam.Team_Name+"'"+"]")).click();  // Select Team to Update
        let l = await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName"));
        l.clear();
        // Change Team Name
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(UpdateTeam.Updated_Team_Name); // Updated Team Name
        // await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();		//Submit
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();	//Cancel
        // if (await driver.findElement(By.className("msg")).isEnabled()) {
        //     await driver.findElement(By.className("ok")).click();
        //     // Change Team Name
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys(UpdateTeam.Updated_Team_Name);  //search for updated team
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        //     await driver.findElement(By.xpath("//span[text()="+"'"+UpdateTeam.Updated_Team_Name+"'"+"]")).click(); //open updated team
        //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();   //cancel
        // }
    });

    it("4. Search existing team from searchbox", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys(searchTeam.Team_Name);  //Search specific team
        await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
        await driver.findElement(By.xpath("//span[text()="+"'"+searchTeam.Team_Name+"'"+"]")).click();       //search for a team
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //cancel

    });

    // it("5. Deactivate existing team", async function () {

    //     //Click on ‘Team Maintenance’ under Admin tab	
    //     await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
    //     await driver.sleep(5000);
    //     await driver.findElement(By.id("opsadm__TeamMaintenance__deactivateBtn_0_txtcnt")).click()
    //     await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_11_txtcnt")).click();
    //     let msg = await driver.findElement(By.xpath("//p[text()='Deactivated Successfully']")).getText().then(function (value) {
    //         return value;
    //     });
    //     if (msg == 'Deactivated Successfully') {
    //         await driver.findElement(By.className("ok")).click();
    //     }
        
    // });

    it("6. Create 2 teams with same details (Status – PendingCore)", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(searchTeam.Duplicate_Team);   // Same Team Name
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(searchTeam.Duplicate_BA);      // Same Business Area
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();       //submit
        let msg = await driver.findElement(By.xpath("//p[text()='Team Already Exists']")).getText().then(function (value) {
            return value;
        });
        if (msg == 'Team Already Exists') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel
        }
    });

    it("7. Create 2 teams with same details (Status – Active)", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(searchTeam.Duplicate_Team);   // Same Team Name
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(searchTeam.Duplicate_BA);      // Same Business Area
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();   //Submit
        let msg = await driver.findElement(By.xpath("//p[text()='Team Already Exists']")).getText().then(function (value) {
            return value;
        });
        if (msg == 'Team Already Exists') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel
        }

    });
    it("8. Create 2 teams with same details (Status – Deactivated)", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(searchTeam.Duplicate_Team);   // Same Team Name
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(searchTeam.Duplicate_BA);      // Same Business Area
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();   //Submit
        let msg = await driver.findElement(By.xpath("//p[text()='Team Already Exists']")).getText().then(function (value) {
            return value;
        });
        if (msg == 'Team Already Exists') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel
        }

    });

    it("9. Add a new team(without entering 'Team name' textbox value)", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
        await driver.findElement(By.id("select2-opsadm__TeamMaintenance__drpdwn-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(searchTeam.Duplicate_BA);      // Same Business Area
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();   //Submit
        await driver.sleep(2000)
        await driver.findElement(By.className("ok")).click();
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel

    });

    it("10. Add a new team (without selecting 'Business Area' dropdown option)", async function () {

        //Click on ‘Team Maintenance’ under Admin tab	
        await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
        await driver.findElement(By.id("opsadm__TeamMaintenanceDM__i__addTeamDetails__teamName")).sendKeys(searchTeam.Duplicate_Team);   // Same Team Name
        await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();   //Submit
        let msg = await driver.findElement(By.xpath("//p[text()='Please Select Business Area']")).getText().then(function (value) {
            return value;
        });
        if (msg == 'Please Select Business Area') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel
        }

    });

    it("11. Add a new team (without entering 'Team name' textbox value and selecting 'Business Area' dropdown option)", async function () {

         //Click on ‘Team Maintenance’ under Admin tab	
         await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();
         await driver.sleep(5000);
         await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_8")).click();   //Add Resource Button
         await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_9")).click();   //Submit
         let msg = await driver.findElement(By.xpath("//p[text()='Please Select all mandatory fields']")).getText().then(function (value) {
             return value;
         });
         if (msg == 'Please Select all mandatory fields') {
             await driver.findElement(By.className("ok")).click();
             await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();  //Cancel
         }
    });

    // // it("12.Update a new team(without entering 'Team name' textbox value)", async function () {

    // //     //Click on ‘Team Maintenance’ under Admin tab	
    // //     await driver.findElement(By.id("lndapp__Landing__teamMaintanence_txtcnt")).click();

    // // });

    // it("13.Change the Status from PendingCore to Active", async function () {

    //     await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
    //     await driver.findElement(By.id("select2-opsadm__TeamTaskMaintenance__teamDrp-container")).click();
    //     await driver.findElement(By.className("select2-search__field")).sendKeys(searchTeam.ChangeStatusTeam);
    //     await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
    //     await driver.findElement(By.id("opsadm__TeamTaskMaintenance__coreTbl_add_btn")).click();
    //     await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName")).sendKeys("Testing-Task");
    //     await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
    //     await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys("Testing-SubTask");
    //     await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys("500");
    //     await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
    //     if (await driver.findElement(By.className("msg")).isEnabled()) {
    //         await driver.findElement(By.className("ok")).click();
    //         await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).sendKeys(earchTeam.ChangeStatusTeam);  //search for added team
    //         await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search")).click();
    //         await driver.findElement(By.xpath("//span[text()="+earchTeam.ChangeStatusTeam+"]")).click(); //open new team
    //         await driver.findElement(By.id("opsadm__TeamMaintenance__el_btn_10")).click();
    //         let s = await driver.findElement(By.id("opsadm__TeamMaintenance__teamSummaryTbl_input_search"));
    //         s.clear();
    //     }

    // });
});

describe("Task Maintenance Screen : ", function () {

    var CoreData = data.Task_Maintenance.Core[0];
    var divertedData = data.Task_Maintenance.Diverted[0];
    var systemdwnData = data.Task_Maintenance.System_Down[0];

    // it("1. Load WFM URL", async function () {
    //     await driver.manage().setTimeouts({ implicit: 10000 });
    //     await driver.get(login.url);
    //     await driver.findElement(By.name("loginfmt")).sendKeys(login.User_id);
    //     await driver.findElement(By.id("idSIButton9")).click();
    //     await driver.findElement(By.name("passwd")).sendKeys(login.password);
    //     await driver.findElement(By.xpath("//input[@value='Sign in']")).click();
    //     await driver.sleep(60000);
    //     let urlText = await driver.getTitle().then(function (value) {
    //         return value;
    //     });
    //     assert.strictEqual(urlText, 'WFMApp');
    //     await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
    // });

    it("2. Create a Task & Sub-Task in Core", async function () {

        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__coreTbl_add_btn")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName")).sendKeys(CoreData.Add_Task[0].Task_Name);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys(CoreData.Add_Task[0].SubTask[0].SubTask_Name);
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys(CoreData.Add_Task[0].SubTask[0].AverageHandling);
        await driver.sleep(3000);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        await driver.findElement(By.className("ok")).click();
        await driver.sleep(3000);
    });

    it("3. Delete a Task in Core", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("td_opsadm__TeamTaskMaintenance__el_icn_1_1")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_3")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_4")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("4. Create a Task in Diverted", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("Diverted")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_add_btn")).click();
        await driver.findElement(By.xpath("//input[@id='opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterDiverted__taskName_10']")).sendKeys(divertedData.Task_Name);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("5. Delete a Task in Diverted", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("Diverted")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_selcb_10")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_rem_btn")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("6. Create two task with same Task name", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__coreTbl_add_btn")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName")).sendKeys(CoreData.Duplicate_Task.Task_Name);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys(CoreData.Duplicate_Task.SubTask.SubTask_Name);
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys(CoreData.Duplicate_Task.SubTask.AverageHandling);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        await driver.sleep(2000)
        // await driver.findElement(By.xpath("//p[text()='Task Name Already Exists. Please Change to Proceed.']")).click();
        // let msg = await driver.findElement(By.xpath("//p[text()='Task Name Already Exists. Please Change to Proceed.']")).getText().then (function (value) {
        // 	return value;
        // });
        // if(msg == 'Task Name Already Exists. Please Change to Proceed.'){
        // 	await driver.findElement(By.className("ok")).click();
        // 	await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
        // }
        await driver.findElement(By.className("ok")).click();
        await driver.sleep(2000);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
    });

    it("7. Create two subtask with same Subtask name", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("td_opsadm__TeamTaskMaintenance__el_icn_1_1")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys(CoreData.Duplicate_Task.SubTask.SubTask_Name);
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys(CoreData.Duplicate_Task.SubTask.AverageHandling);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        await driver.sleep(10000);
        // await driver.findElement(By.xpath("//p[text()='Duplicate SubTasks']")).click();
        // let msg1 = await driver.findElement(By.xpath("//p[text()='Duplicate SubTasks']")).getText().then (function (value) {
        // 	return value;
        // });
        // if(msg1 == 'Duplicate SubTasks'){
        // 	await driver.findElement(By.className("ok")).click();
        // 	await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
        // }
        await driver.findElement(By.className("ok")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_6")).click();
    });

    it("8. Create a task(without entering ‘Task Name’ Textbox Value) in Core", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__coreTbl_add_btn")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        let msg2 = await driver.findElement(By.xpath("//p[text()='Please input all mandatory fields']")).getText().then(function (value) {
            return value;
        });
        if (msg2 == 'Please input all mandatory fields') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
        }
    });

    it("9. Create a subtask(without entering ‘Subtask Name’ Textbox Value & 'AvgHandlingTime’ Textbox Value) in Core", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("td_opsadm__TeamTaskMaintenance__el_icn_1_1")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__subTaskCore_add_btn")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();	//Submit
        let msg2 = await driver.findElement(By.xpath("//p[text()='Please input all mandatory fields']")).getText().then(function (value) {
            return value;
        });
        if (msg2 == 'Please input all mandatory fields') {
            await driver.findElement(By.className("ok")).click();
            await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_1")).click();
            await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_6")).click();
        }
    });

    it("10. Update a task in Core", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("td_opsadm__TeamTaskMaintenance__el_icn_1_1")).click();
        let l = await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName"));
        l.clear();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmTaskMasterCore__taskName")).sendKeys(CoreData.Update_Task[0].Task_Name);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        let msg2 = await driver.findElement(By.xpath("//p[text()='Updated Successfully']")).getText().then(function (value) {
            return value;
        });
        if (msg2 == 'Updated Successfully') {
            await driver.findElement(By.className("ok")).click();
        }
    });

    it("11. Update a subtask & Average handling time in Core", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("td_opsadm__TeamTaskMaintenance__el_icn_1_1")).click();
        let subtask = await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0"));
        subtask.clear();
        let aht = await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0"));
        aht.clear();
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__subtaskName_0")).sendKeys(CoreData.Update_Task[0].SubTask[0].SubTask_Name);
        await driver.findElement(By.id("opsadm__TaskSubtaskMapping__i__tbWfmSubtaskMaster__avgHandlingTime_0")).sendKeys(CoreData.Update_Task[0].SubTask[0].AverageHandling);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__el_btn_2")).click();
        let msg2 = await driver.findElement(By.xpath("//p[text()='Updated Successfully']")).getText().then(function (value) {
            return value;
        });
        if (msg2 == 'Updated Successfully') {
            await driver.findElement(By.className("ok")).click();
        }
    });

    it("12. Update a task in System Down", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("System Down")).click();
        let sysdwn = await driver.findElement(By.id("opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterSystemDown__taskName_0"));
        sysdwn.clear();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterSystemDown__taskName_0")).sendKeys(systemdwnData.Task_Name);
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("13. Create a task(without entering ‘Task Name’ Textbox Value) in Diverted", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("Diverted")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_add_btn")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
        // await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_selcb_11")).click();
        // await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_rem_btn")).click();
    });

    it("14: Addtional-Create a Task in Diverted", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("Diverted")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_add_btn")).click();
        await driver.findElement(By.xpath("//input[@id='opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterDiverted__taskName_10']")).sendKeys("Test");
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
    });

    it("15. Update a task in Diverted", async function () {
        await driver.findElement(By.id("lndapp__Landing__taskMaintanence_txtcnt")).click();
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.Task_Maintenance.Team_Name);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.linkText("Diverted")).click();
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__divertedTbl_add_btn")).click();
        let divTask = await driver.findElement(By.xpath("//input[@id='opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterDiverted__taskName_10']"));
        divTask.clear();
        await driver.findElement(By.xpath("//input[@id='opsadm__TeamTaskMaintenanceUI__i__tbWfmTaskMasterDiverted__taskName_10']")).sendKeys("Task12");
        // let msg2 = await driver.findElement(By.xpath("//p[text()='Updated Successfully']")).getText().then (function (value) {
        // 	return value;
        // });
        // if(msg2 == 'Updated Successfully'){
        //     await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        //     await driver.findElement(By.className("ok")).click();  
        // }       
        await driver.findElement(By.id("opsadm__TeamTaskMaintenance__saveBtn")).click();
        await driver.findElement(By.className("ok")).click();
    });

});

describe("Employee Maintenance Screen : ", function () {
    
    // it("1. Load WFM URL", async function () {
    //     await driver.manage().setTimeouts({ implicit: 10000 });
    //     await driver.get(login.url);
    //     await driver.sleep(2000);
    //     await driver.findElement(By.name("loginfmt")).sendKeys(login.User_id);
    //     await driver.findElement(By.id("idSIButton9")).click();
    //     await driver.findElement(By.name("passwd")).sendKeys(login.password);
    //     await driver.findElement(By.xpath("//input[@value='Sign in']")).click();
    //     await driver.sleep(60000);
    //     let urlText = await driver.getTitle().then(function (value) {
    //         return value;
    //     });
    //     assert.strictEqual(urlText, 'WFMApp');
    //     await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
    //     await driver.sleep(2000);
    //     await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
    // });

    it("2. Add Contractor/ Offshore Employee Information ", async function () {

        await driver.sleep(2000);
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[text()='Offshore/ Contractor Employees']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__firstName")).sendKeys("Selenium"); //First Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__surname")).sendKeys("Test"); //Last Name textbox
        await driver.findElement(By.xpath("//span[@title='Please select Position Title']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Analyst Cross Channel");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.xpath("//span[@title='Please Select Contract Type']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Contractor");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__personnelNumber")).sendKeys("9061399");
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__employeeDetails__emailAddress")).sendKeys("yuvraj@xyz.com");

        await driver.findElement(By.xpath("//span[@title='Please select team']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("ESU 1");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);

        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).click(); //Role dropdown
        await driver.findElement(By.xpath("//span[@class='select2-selection select2-selection--multiple']")).sendKeys(Key.UP, Key.UP, Key.UP, Key.RETURN);
        // await driver.findElement(By.id("opsadm__EmployeeSummary__teamTbl_add_btn")).click(); //Other Details - 'Plus' button
        // await driver.findElement(By.xpath("(//span[@title='Please select team']/following-sibling::span)[1]")).click(); //Team dropdown
        // await driver.findElement(By.className("select2-search__field")).sendKeys("TFO 1 - AMS", Key.RETURN);
        // await driver.findElement(By.id("opsadm__TeamMappingCustom__i__teamMapping__isPrimaryTeam_1_lbl")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__btnSubmit")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__btnCancel")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_10")).click();
    })

    //Modify Contractor/ Offshore Employee Information (Offshore Employee)
    it("3. Modify Contractor/ Offshore Employee Information (Offshore Employee)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
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
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).clear();
    });

    it("4. Select Filter By Dropdown 'Role'", async function () {
        await driver.sleep(5000);
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='2']")).click();
        await driver.sleep(1000);
        // await driver.findElement(By.xpath("//span[text()='Please select Role']")).click();


    });

    it("5. Select Role Dropdown 'Senior Manager'", async function () {

        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='2']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//span[text()='Please select Role']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Senior Manager");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        await driver.sleep(5000);
        let seniorManager = await driver.findElement(By.className("select2-selection__choice")).getText();
        if (seniorManager == 'Senior Manager') {
            await driver.findElement(By.xpath("//button[@id='opsadm__EmployeeSummary__btnCancel']")).click();
            assert.ok(true);
        } else {
            assert.ifError("Role is Not 'Senior Manager'");
        }

        // await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click();

    });

    it("6. Select Role Dropdown 'Manager' ", async function () {

        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='2']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//span[text()='Please select Role']")).click();
        await driver.sleep(5000);
        await driver.findElement(By.className("select2-search__field")).sendKeys("Manager");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[text()='Demo']")).click();
        var manager = await driver.findElement(By.className("select2-selection__choice")).getText();
        if (manager == 'Manager') {
            await driver.findElement(By.xpath("//button[@id='opsadm__EmployeeSummary__btnCancel']")).click();
            assert.ok(true);
        } else {
            assert.ifError("Role is Not 'Manager'");
        }

    });

    it("7. Select Role Dropdown 'Partner'", async function () {

        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='2']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//span[text()='Please select Role']")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys("Partner");
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//span[text()='TESTP']")).click();
        var partner = await driver.findElement(By.className("select2-selection__choice")).getText();
        if (partner == 'Partner') {
            await driver.findElement(By.xpath("//button[@id='opsadm__EmployeeSummary__btnCancel']")).click();
            assert.ok(true);
        } else {
            assert.ifError("Role is Not 'Partner'");
        }

    });

    // it("6. Select Role Dropdown 'OPS Admin' ", async function () {

    //     await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
    //     await driver.sleep(2000);
    //     var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
    //     select.click();
    //     await driver.findElement(By.xpath("//li[@data-value='2']")).click();
    //     await driver.sleep(1000);
    //     await driver.findElement(By.xpath("//span[text()='Please select Role']")).click();
    //     await driver.findElement(By.className("select2-search__field")).sendKeys("OPS Admin");
    //     await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
    //     await driver.sleep(2000);
    //     await driver.findElement(By.linkText("3")).click();
    //     await driver.findElement(By.xpath("//span[text()='Hemalatha']")).click();
    //     var opsAdmin = await driver.findElement(By.className("select2-selection__choice")).getText();
    //     if (opsAdmin == 'OPS Admin') {
    //         await driver.findElement(By.xpath("//button[@id='opsadm__EmployeeSummary__btnCancel']")).click();
    //         assert.ok(true);
    //     } else {
    //         assert.ifError("Role is Not 'OPS Admin'");
    //     }
    //     // await driver.findElement(By.id("opsadm__EmployeeSummary__btnModify")).click();

    // });




    //Filter By - 'Team'
    it("8. Filter By - 'Team'", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(5000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();             //Filter By dropdown button
        await driver.findElement(By.xpath("//li[@data-value='1']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("//span[text()='Please select team']")).click(); //Team dropdown button
        await driver.findElement(By.xpath("//span[@class='select2-search select2-search--dropdown']//input[1]")).sendKeys("ESU 1");
        await driver.findElement(By.xpath("//span[@class='select2-search select2-search--dropdown']//input[1]")).sendKeys(Key.ENTER);

        //test report
        if (await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt"))) {
            assert.ok(true);
        } else if (await driver.findElement(By.className("noDatatxt")) == "No Data Found") {
            assert.ok(true, 'No Data Found');
        } else {
            assert.ifError("Employee Maintenance - Filter By 'Team' is not verfied");
        }
    });

    //Search Contractor/Offshore Employee details [Filter By - 'Team']
    it("9. Search Contractor/Offshore Employee details [Filter By - 'Team']", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();

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
    it("10. Temporarily deactivate access (Offshore/Onshore Employee)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
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
    it("11. Temporarily deactivate access (Offshore Employee)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
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
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).clear();
    });

    //Modify Contractor/ Offshore Employee Information (without entering 'Role' dropdown option)
    it("12. Modify Contractor/ Offshore Employee Information (without entering \'Role\' dropdown option)", async function () {
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
    it("13. Modify Contractor/ Offshore Employee Information (without entering \'Primary\' checkbox in Team sub-table) (Offshore Employee)", async function () {
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
    it("14. Filter By - \'Employee Details\'", async function () {
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
    it("15. Search Employee by \'First Name\' [Filter By - \'Employee Details\']", async function () {
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).clear();
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
    it("16. Search Employee by \'Last Name\' [Filter By - \'Employee Details\']", async function () {
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
    it("17. Search Employee by \'Email\' [Filter By - \'Employee Details\']", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__email")).sendKeys("selenium.test@i-exceed.com"); //Email Name textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        // await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
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
    it("18. Search Employee by \'First Name\' [Filter By - \'Employee Id\']", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__employeeId")).sendKeys("9995995"); //Employee Id textbox
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
        // await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click(); //SEARCH button
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

    });

    //Modify Contractor/ Offshore Employee Information (Offshore Employee)
    it("19. Modify Contractor/ Offshore Employee Information (Offshore Employee)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
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
    it("20. Modify Contractor/ Offshore Employee Information (Onshore Employee)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Pradeepreddy"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
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
    it("21. Modify Contractor/ Offshore Employee Information (add new 'Team sub-table' in Other Details)", async function () {
        //add team sub-table
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
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
    it("22. Modify Contractor/ Offshore Employee Information (without entering \'First Name\' value)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        // const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        // await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
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
    it("23. Modify Contractor/ Offshore Employee Information (without entering \'Last Name\' value)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        // const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        // await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
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
    it("24. Modify Contractor/ Offshore Employee Information (without entering \'Contract Type\' dropdown option)", async function () {
        await driver.findElement(By.id("lndapp__Landing__employeeList_txtcnt")).click();
        await driver.sleep(2000);
        var select = await driver.findElement(By.id("opsadm__EmployeeSummary__filterByDrp_ul"));
        select.click();
        await driver.findElement(By.xpath("//li[@data-value='3']")).click();
        await driver.findElement(By.id("opsadm__EmployeeSummaryDM__i__opsadm__EmployeeSummaryDM_Req__firstName")).sendKeys("Selenium");
        await driver.findElement(By.id("opsadm__EmployeeSummary__el_btn_5")).click();
        await driver.findElement(By.xpath("//span[text()='Selenium']")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).click();
        // await driver.findElement(By.id("opsadm__EmployeeSummary__summaryTbl_input_search")).sendKeys("Selenium"); //Searchbox
        // await driver.findElement(By.id("opsadm__EmployeeSummaryDM__o__tbmEmployeeData__firstName_0_txtcnt")).click();
        // const element = await driver.findElement(By.id("opsadm__EmployeeSummary__empModal"));
        // await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
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

    
});

describe("User Statistics screen: ", function () {


    // //MICROSOFT LOGIN (SSO)
    // it("MICROSOFT LOGIN (SSO)", async function () {
    //     await driver.manage().setTimeouts({ implicit: 10000 });
    //     await driver.manage().window().maximize();
    //     await driver.get(login.url); //Launch WFM app
    //     await driver.findElement(By.id("i0116")).sendKeys(login.User_id); //Email ID
    //     await driver.findElement(By.id("idSIButton9")).click();
    //     await driver.findElement(By.id("i0118")).sendKeys(login.password); //Password
    //     await driver.sleep(2000);
    //     await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();
    //     await driver.sleep(45000);

    //     //test report
    //     let verifyText = await driver.getTitle()
    //         .then(function (value) {
    //             return value;
    //         });

    //     try {
    //         assert.strictEqual(verifyText, "WFMApp");
    //     } catch {
    //         assert.ifError('MS Login has failed');
    //     };
    // });

    //Open User Statistics
    it("Open (Admin) User Statistics sub-section", async function () {
        // await driver.findElement(By.id("lndapp__Landing__WfmAdminOpsMenu_txtcnt")).click();
        await driver.sleep(500);
        // const element = await driver.findElement(By.id("sidebar"));
        // await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
        await driver.sleep(500);
        await driver.findElement(By.id("lndapp__Landing__userStatistics_txtcnt")).click()
        // await driver.sleep(2000);

        //test report
        let verifyText = await driver.findElement(By.id("lndapp__Landing__userStatistics_txtcnt"))
            .getText().then(function (value) {
                return value;
            });

        try {
            assert.strictEqual(verifyText, "User Statistics");
        } catch {
            assert.ifError('User Statistics screen is not loaded');
        };
    });

    //Verify Count details
    it("Verify Count details", async function () {
        await driver.sleep(5000);
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_1_span_")).click(); //Count radio button
        await driver.findElement(By.id("btn_icon_icon-refresh")).click() //Refresh button

        //test report
        let verifyText = await driver.findElement(By.id("opsadm__UserStatistics__el_txt_5_txtcnt"))
            .getText().then(function (value) {
                return value;
            });

        try {
            assert.strictEqual(verifyText, "USER STATISTICS - CURRENT DATE");
        } catch {
            assert.ifError('Count details are not verfied');
        };

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-countDetails.png', encodedString, 'base64');
        console.log("Count details screenshot is generated");
    });

    //Verify Email ID details - Appointment Booking
    it("Verify Count details", async function () {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("Appointment Booking");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-emailIDDetails(APB).png', encodedString, 'base64');
        console.log("Email ID details - Appointment Booking screenshot is generated");

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(login.User_id);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);

        //test report
        if (driver.findElements(By.className(login.User_id))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - Appointment Booking are not verfied');
        }
    });

    //Verify Email ID details - WFM Ops
    it("Verify Count details", async function () {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("WFM Ops");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-emailIDDetails(WFMOps).png', encodedString, 'base64');
        console.log("Email ID details - WFM Ops screenshot is generated");

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(login.User_id);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);

        //test report
        if (driver.findElements(By.className(login.User_id))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - WFM Ops are not verfied');
        }
    });

    //Verify Email ID details - WFM Branch
    it("Verify Count details", async function () {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("WFM Branch");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-emailIDDetails(WFMBranch).png', encodedString, 'base64');
        console.log("Email ID details - WFM Branch screenshot is generated");

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(login.User_id);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);

        //test report
        if (driver.findElements(By.className(login.User_id))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - WFM Branch are not verfied');
        }
    });

    //Verify Email ID details - Leads
    it("Verify Count details", async function () {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("Leads");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-emailIDDetails(Leads).png', encodedString, 'base64');
        console.log("Email ID details - Leads screenshot is generated");

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(login.User_id);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);

        //test report
        if (driver.findElements(By.className(login.User_id))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - Leads are not verfied');
        }
    });

    //Verify Email ID details - CSS
    it("Verify Count details", async function () {
        await driver.findElement(By.id("opsadm__UserStatistics__type_option_2_span_")).click(); //Email ID radio button
        await driver.sleep(500);
        await driver.findElement(By.css(".select2-selection__arrow")).click();
        await driver.findElement(By.css(".select2-search__field")).sendKeys("CSS");
        await driver.findElement(By.css(".select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("opsadm__UserStatistics__el_label_2")).click();

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/userStatistics-emailIDDetails(CSS).png', encodedString, 'base64');
        console.log("Email ID details - CSS screenshot is generated");

        //Search user
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).click();
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(login.User_id);
        await driver.findElement(By.id("opsadm__UserStatistics__ct_tbl_2_input_search")).sendKeys(Key.ENTER);

        //test report
        if (driver.findElements(By.className(login.User_id))) {
            assert.ok(true);
        } else if (driver.findElement(By.className("noDatatxt"))) {
            assert.ok(true);
        } else {
            assert.ifError('Email ID details - CSS are not verfied');
        }

        await driver.quit(); //Close browser
    });

});