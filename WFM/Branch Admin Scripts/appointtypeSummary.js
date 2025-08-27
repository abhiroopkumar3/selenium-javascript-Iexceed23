const { By, Key, Builder } = require("selenium-webdriver");
require("edgedriver");
const assert = require("assert");
const fs = require("fs");

var login = require("./Login.json");
var data = require("./Data.json");
JSON.stringify(login, true) // Load login file
JSON.stringify(data, true)

//Launch Edge browser in incognito mode
var edgeOptions = { browserName: 'MicrosoftEdge', 'ms:edgeOptions': {
        args: ['-inprivate']
    }
}
let driver = new Builder().withCapabilities(edgeOptions).build();

describe("Appointment Type Summary Screen : ", function () {

    // var EmployeeName = data.Employee_Directory.Search_Employee;

    this.afterAll(async function(){
        await driver.quit();
    })

    it("Load WFM URL", async function () {
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.get(login.url);
        await driver.findElement(By.name("loginfmt")).sendKeys(login.User_id);
        await driver.findElement(By.id("idSIButton9")).click();
        await driver.findElement(By.name("passwd")).sendKeys(login.password);
        await driver.findElement(By.xpath("//input[@value='Sign in']")).click();
        await driver.sleep(15000);
        let urlText = await driver.getTitle().then(function (value) {
            return value;
        });
        assert.strictEqual(urlText, 'WFMApp');
    });

    // EmployeeName.forEach(element => {
        it('Search Appointment Type', async function () {
            const element = await driver.findElement(By.id("sidebar"));
            await driver.actions().scroll(0, 0, 0, 200, element).perform(); //Mouse scroll down
            await driver.sleep(500);
            await driver.findElement(By.id("lndapp__Landing__BranchAdminMenu_txtcnt")).click();
            await driver.findElement(By.id("lndapp__Landing__aptSummary_txtcnt")).click();
            await driver.sleep(500);
            await driver.findElement(By.id("opsadm__AppointmentTypeSummary__ct_tbl_1_input_search")).sendKeys("Test Appointment 2", Key.RETURN);
            
            let verifyText = await driver.findElement(By.id("opsadm__APBRefSummary__i__tbApbReferenceData__appointmentType_0_txtcnt")).then(function (value) {
                return value;
            });


            try{
                assert.strictEqual(verifyText, 'Test Appointment 2');
            } catch(err){
                assert.ifError('Appintment Type does not exist');
                console.log(err)
            }

            await driver.findElement(By.id("lndapp__Landing__aptSummary_txtcnt")).click();

            //Generate screenshot
            let encodedString = await driver.takeScreenshot();
            fs.writeFileSync('./Screenshots/appointtypeSummary.png', encodedString, 'base64');
            console.log("Appointment Type Summary screenshot is generated");
        });
    // });

});