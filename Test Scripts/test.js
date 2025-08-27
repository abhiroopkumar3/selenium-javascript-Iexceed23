const {By,Key,Builder} = require("selenium-webdriver");
require("geckodriver");

async function example(){

    var searchString = "Automation testing with Selenium and JavaScript";
 
    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

     //To fetch google from the browser with our code.
     await driver.get("https://www.google.com/");
         
     //To send a search query by passing the value in searchString.
     await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);

     //Verify the page title and print it
     var title = await driver.getTitle();
     console.log('Title is:',title);

     //It is always a safe practice to quit the browser after execution
     await driver.quit();

}

example()