const {By,Key,Builder} = require("selenium-webdriver");
require("geckodriver");
const {Console} = require("console");
const fs = require("fs");

//Make a new logger
const myConsole = new Console({
    stdout: fs.createWriteStream("(MS_Login)console-log.txt"), //write stream
    stderr: fs.createWriteStream("(MS_Login)error-log.txt"), //write stream
    });

async function MS_Login(){

    //Declare variables
    var testCaseArray = new Array();
    var status;
    var data = 'TEST CASE ID'+'\t'+'TEST CASE DESCRIPTION'+'\t'+'TEST CASE TYPE'+'\t'+'STATUS'+'\n'; //Excel file heading

//Launch browser
    // let driver = await new Builder().forBrowser('chrome').build();
    // await driver.manage().window().maximize();
    // await driver.manage().setTimeouts({implicit:10000});

//Launch chrome browser in incognito mode
    var webdriver = require('selenium-webdriver');
    var chromeCapabilities = webdriver.Capabilities.chrome();
    var chromeOptions = {'args': ['--test-type', '---incognito']};
    chromeCapabilities.set("goog:chromeOptions", chromeOptions);
    var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({implicit:10000});
    console.log("\n","\n" + "MICROSOFT LOGIN (SSO) TEST CASES","\n"); //Console heading

    //Launch WFM app
    await driver.get("https://tsbapps.appzillon.com/WFMSSO/"); //Public access URL
    // await driver.get("https://apps.appzillon.com/WFMSSO/"); //i-exceed VPN should be connected

//Microsoft Login (SSO) with correct credentials
    await driver.sleep(500);
    await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
    await driver.findElement(By.id("idSIButton9")).click();
    await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();
    await driver.sleep(10000);

    //test report
    try{
        let expectedHeading = 'WFMApp';
        let heading = await driver.getTitle();
        if(expectedHeading == heading) {
            status = "PASS";
            console.log('Microsoft Login (SSO) with correct credentials: PASS [POSITIVE]');
        }else {
            status = "FAIL";
            console.log('Microsoft Login (SSO) with correct credentials: FAIL [POSITIVE]');
        };
        testCaseArray.push({
            'TEST_CASE_ID':'WFM_MS_Login_TC001',
            'TEST_CASE_DESCRIPTION':'Microsoft Login (SSO) with correct credentials',
            'TEST_CASE_TYPE':'POSITIVE',
            'STATUS':status,
        });
    }catch(err) {
        console.log('Test failed with reason = ' + err);
        myConsole.error('Test failed with reason = ' + err);
    };
    await driver.sleep(5000);

//Microsoft Login (SSO) with incorrect Email ID
    await driver.switchTo().newWindow('window'); //Open new window
    await driver.get("https://tsbapps.appzillon.com/WFMSSO/"); //Public access URL
    // await driver.get("https://apps.appzillon.com/WFMSSO/"); //i-exceed VPN should be connected
    await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@google.com"); //Email ID
    await driver.findElement(By.id("idSIButton9")).click();

    //test report
    try{
        if(await driver.findElements(By.id("usernameError"))) {
            status = "PASS";
            console.log('Microsoft Login (SSO) with incorrect Email ID: PASS [NEGATIVE]');
        }else {
            status = "FAIL";
            console.log('Microsoft Login (SSO) with incorrect Email ID: FAIL [NEGATIVE]');
        };
        testCaseArray.push({
            'TEST_CASE_ID':'WFM_MS_Login_TC002',
            'TEST_CASE_DESCRIPTION':'Microsoft Login (SSO) with incorrect Email ID',
            'TEST_CASE_TYPE':'NEGATIVE',
            'STATUS':status,
        });
    }catch(err) {
        console.log('Test failed with reason = ' + err);
        myConsole.error('Test failed with reason = ' + err);
    };

//Microsoft Login (SSO) with incorrect Password
    await driver.get("https://tsbapps.appzillon.com/WFMSSO/"); //Public access URL
    // await driver.get("https://apps.appzillon.com/WFMSSO/"); //i-exceed VPN should be connected
    await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
    await driver.findElement(By.id("idSIButton9")).click();
    await driver.findElement(By.id("i0118")).sendKeys("XYZW"); //Password
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();

    //test report
    try{
        if(await driver.findElements(By.id("passwordError"))) {
            status = "PASS";
            console.log('Microsoft Login (SSO) with incorrect Password: PASS [NEGATIVE]');
        }else {
            status = "FAIL";
            console.log('Microsoft Login (SSO) with incorrect Password: FAIL [NEGATIVE]');
        };
        testCaseArray.push({
            'TEST_CASE_ID':'WFM_MS_Login_TC003',
            'TEST_CASE_DESCRIPTION':'Microsoft Login (SSO) with incorrect Password',
            'TEST_CASE_TYPE':'NEGATIVE',
            'STATUS':status,
        });
    }catch(err) {
        console.log('Test failed with reason = ' + err);
        myConsole.error('Test failed with reason = ' + err);
    };

//Microsoft Login (SSO) with incorrect OTP
    await driver.get("https://tsbapps.appzillon.com/WFMSSO/"); //Public access URL
    // await driver.get("https://apps.appzillon.com/WFMSSO/"); //i-exceed VPN should be connected
    await driver.findElement(By.id("i0116")).sendKeys("abhiroop.kumar@i-exceed.com"); //Email ID
    await driver.findElement(By.id("idSIButton9")).click();
    await driver.findElement(By.id("i0118")).sendKeys("iexceed@41313"); //Password
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@data-report-event='Signin_Submit']")).click();

    //test report
    try{
        if(await driver.findElements(By.className("row text-title"))) {
            status = "PASS";
            console.log('Microsoft Login (SSO) with incorrect OTP: PASS [NEGATIVE]');
        }else {
            status = "FAIL";
            console.log('Microsoft Login (SSO) with incorrect OTP: FAIL [NEGATIVE]');
        };
        testCaseArray.push({
            'TEST_CASE_ID':'WFM_MS_Login_TC004',
            'TEST_CASE_DESCRIPTION':'Microsoft Login (SSO) with incorrect OTP',
            'TEST_CASE_TYPE':'NEGATIVE',
            'STATUS':status,
        });
    }catch(err) {
        console.log('Test failed with reason = ' + err);
        myConsole.error('Test failed with reason = ' + err);
    };
    await driver.sleep(10000);

//Add data to log file
    myConsole.log("MICROSOFT LOGIN (SSO) TEST CASES","\n"); //log file heading
    myConsole.log(testCaseArray);

//Generate Excel file
    fs.truncate('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/WFM/Old Scripts', 0, function(){console.log('')}) //filepath
    for (var i = 0; i < testCaseArray.length; i++) {
        data = data + testCaseArray[i].TEST_CASE_ID + '\t' + testCaseArray[i].TEST_CASE_DESCRIPTION + '\t' + testCaseArray[i].TEST_CASE_TYPE + '\t' + testCaseArray[i].STATUS + '\n';
    }

    //Delete old excel file
    fs.unlink('/home/i-exceed.com/abhiroop.kumar/Documents/Selenium_JavaScript/WFM/Old Scripts/' + '(MS_Login)test-report.xlsx', (err) => {
        if (err) throw err;
        console.log("(Old excel report is deleted)");
    });

    fs.appendFile('(MS_Login)test-report.xlsx', data, (err) => {
        if (err) throw err;
        console.log('\n' + 'Excel report is generated');
        myConsole.log('\n' + 'Excel report \'(MS_Login)test-report.xlsx\' is generated');
    });

//Close browser
    await driver.quit();

};

MS_Login();