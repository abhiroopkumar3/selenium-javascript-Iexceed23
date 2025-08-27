const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");
// get the Console class
const { Console, assert } = require("console");
// get fs module for creating write streams
const fs = require("fs");

// make a new logger
const myConsole = new Console({
  stdout: fs.createWriteStream("test3Out.txt"), // a write stream,
  stderr: fs.createWriteStream("test3Err.txt"), // a write stream
});

async function googlesearch(){

    var testCaseArray = new Array();
    var status;
    var error;
    var data = 'TEST CASE ID'+'\t'+'TEST CASE DESCRIPTION'+'\t'+'TEST CASE TYPE'+'\t'+'STATUS'+'\n';

    let driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    console.log("\n","EXPECTED HEADING","\n");

    await driver.manage().setTimeouts({implicit:10000});
    await driver.get('https://www.google.com/');
    await driver.findElement(By.name("q")).sendKeys("Selenium Testing Automation using JavaScript\n");

    try{
        let expectedHeading = 'APPLICATION TEST DRIVE';
        let heading = await driver.findElement(By.xpath("//h3[text()='Automation Testing with Selenium JavaScript [Tutorial]']")).getText();
        if (expectedHeading == heading) {
            status = "PASSED"
            console.log('Test Case: PASS','\n' + 'Description : ' + heading + ' is loaded');
        } else {
            status = "FAILED"
            console.log('Test Case: FAIL','\n' + 'Description : ' + heading + ' is not loaded');
        testCaseArray.push({
            'TEST_CASE_ID':'SCREEN TEXT',
            'TEST_CASE_DESCRIPTION':'Verify searched screen text',
            'TEST_CASE_TYPE':'POSITIVE',
            'STATUS':status,
        })
      }
    }catch(error){
        console.error("Test failed with reason " + error)
        driver.quit();
    }

    myConsole.log("EXPECTED HEADING","\n");
    myConsole.log(testCaseArray);
    myConsole.error(error);

    fs.truncate('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/Test Scripts/', 0,function(){console.log('')})
    for (var i = 0; i < testCaseArray.length; i++) {
        data = data + testCaseArray[i].TEST_CASE_ID + '\t' + testCaseArray[i].TEST_CASE_DESCRIPTION + '\t' + testCaseArray[i].TEST_CASE_TYPE + '\t' + testCaseArray[i].STATUS + '\n';
    }

    fs.appendFile('test3.xlsx', data, (err) => {
        if (err) throw err;
        console.log('\n' + 'Excel report is generated');
        myConsole.log('\n' + 'Excel report is generated');
    });

/*     fs.writeFile('test4.xlsx', data, (err) => {
        if (err) throw err;
        console.log('Excel report is generated');
        myConsole.log('Excel report is generated');
    });  */

    let encodedString = await driver.takeScreenshot();
    fs.writeFileSync('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/Test Scripts/expectedHeading.png', encodedString, 'base64');
    console.log();

    await driver.quit();
};

googlesearch();