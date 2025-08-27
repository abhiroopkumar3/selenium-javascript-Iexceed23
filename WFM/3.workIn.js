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

// var rows = document.getElementById('workin__WorkInMaintenance__ct_tbl_1_tbody').rows.length;

describe("Work In Screen : ", function () {

    var login = require("./Login.json");
    var data = require("./Data.json");
    JSON.stringify(login, true) // Load login file
    JSON.stringify(data, true)
    var rows, k = 0, j = 0;
    it("1. Load WFM URL", async function () {
        await driver.manage().window().maximize();
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


    it("2. Open OPS Shift Screen", async function () {
        await driver.sleep(6000);
        await driver.findElement(By.xpath("//span[text()='Work In']")).click();
        await driver.sleep(6000);
        var workIn = await driver.findElement(By.xpath("//h4[text()='Work In']")).getText().then(function (value) {
            return value;
        });
        assert.strictEqual(workIn, 'WORK IN');

        //Generate screenshot
        let encodedString = await driver.takeScreenshot();
        fs.writeFileSync('./Screenshots/workIn.png', encodedString, 'base64');
        console.log("Count details screenshot is generated");
    });


    it("3. Add units for subtask", async function () {
        await driver.findElement(By.id("select2-workin__WorkInMaintenance__wTeamDrp-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.WorkIn.AddTeam);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("workin__WorkInMaintenance__el_inp_1")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("(//div[text()='18'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.findElements(By.xpath(".//tbody/tr")).then(function (tableRows) {
            rows = tableRows.length;
        })
        for (i = 0; i < rows; i++) {
            var subTask;
            subTask = await driver.findElement(By.id("workin__WorkInUnitDM__i__tbWfmTeamWorkinUnit__subtaskName_" + i + "_txtcnt")).getText().then(function (value) {
                return value;
            });
            if (subTask != "N/A") {
                await driver.findElement(By.id("workin__WorkInUnitDM__i__tbWfmTeamWorkinUnit__unit_" + i)).sendKeys(data.WorkIn.unitArray[j]);
                j++;

            }
        }
        await driver.findElement(By.id("workin__WorkInMaintenance__workInSubmitBtn")).click();
        let msg = await driver.findElement(By.className("msg")).getText();
        if (msg = "WorkIn Data Updated successfully") {
            await driver.findElement(By.className("ok")).click();
        }
        else {
            assert.ifError("Data not Added");
        }


    });

    it("4. Modify units for subtask", async function () {
        await driver.findElement(By.id("select2-workin__WorkInMaintenance__wTeamDrp-container")).click();
        await driver.findElement(By.className("select2-search__field")).sendKeys(data.WorkIn.ModifiedTeam);
        await driver.findElement(By.className("select2-search__field")).sendKeys(Key.ENTER);
        await driver.findElement(By.id("workin__WorkInMaintenance__el_inp_1")).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath("(//div[text()='18'])[2]")).click();
        await driver.findElement(By.xpath("//div[text()='Set']")).click();
        await driver.findElements(By.xpath(".//tbody/tr")).then(function (tableRows) {
            rows = tableRows.length;
        })

        for (i = 0; i < rows; i++) {
            var subTask;
            subTask = await driver.findElement(By.id("workin__WorkInUnitDM__i__tbWfmTeamWorkinUnit__subtaskName_" + i + "_txtcnt")).getText().then(function (value) {
                return value;
            });
            if (subTask != "N/A") {
                await driver.findElement(By.id("workin__WorkInUnitDM__i__tbWfmTeamWorkinUnit__unit_" + i)).clear();
                await driver.findElement(By.id("workin__WorkInUnitDM__i__tbWfmTeamWorkinUnit__unit_" + i)).sendKeys(data.WorkIn.modifiedUnitArray[k]);
                k++;

            }
        }

        await driver.findElement(By.id("workin__WorkInMaintenance__workInSubmitBtn")).click();
        let msg = await driver.findElement(By.className("msg")).getText();
        if (msg = "WorkIn Data Updated successfully") {
            await driver.findElement(By.className("ok")).click();
        }
        else {
            assert.ifError("Data not Updated");
        }

    });


});