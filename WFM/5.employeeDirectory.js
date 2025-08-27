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

describe("Employee Directory Screen : ", function () {

    var EmployeeName = data.Employee_Directory.Search_Employee;

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

    EmployeeName.forEach(element => {
        it(`Verify employee details for user - \'${element.Employee_Name}\'`, async function () {
            await driver.findElement(By.id("lndapp__Landing__empDirectoryMenu_txtcnt")).click();
            await driver.sleep(5000);
            await driver.findElement(By.id("empdir__EmployeeDirectory__searchValue")).click();
            await driver.findElement(By.id("empdir__EmployeeDirectory__searchValue")).sendKeys(element.Employee_Name);
            await driver.sleep(2000);
            await driver.findElement(By.id("empdir__EmployeeList__o__empdir__EmployeeList_Res__fullName_0_txtcnt")).click();
            await driver.findElement(By.id("empdir__ReportingTo__reportingName_txtcnt")).click();
            await driver.findElement(By.css(".ok")).click();
            await driver.sleep(500);

            let verifyText = await driver.findElement(By.id("empdir__EmployeeDetails__empName_txtcnt")).getText()
            console.log(verifyText);

            try{
                assert.strictEqual(verifyText, element.Employee_Name);
            } catch(err){
                assert.ifError('Employee Directory screen verification has failed');
                console.log(err)
            }

            await driver.findElement(By.css("#empdir__EmployeeDetails__el_icn_2 > use")).click();

            //Generate screenshot
            let encodedString = await driver.takeScreenshot();
            fs.writeFileSync('./Screenshots/employeeDirectory.png', encodedString, 'base64');
            console.log("Employee Directory screenshot is generated");
        });
    });

});