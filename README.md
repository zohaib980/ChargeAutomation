If you have to run saperate file having multiple 'It' block you need to use cmd:
Syntax:
* npx cypress run --spec filePath 
In this way, it will run on Cypress default browser like Electron. 

If you want to run on specific browser like chrome then please add...
* npx cypress run --spec filePath --browser chrome

Complete CMD example:
1. npx cypress run --spec cypress/e2e/Regression/ComPreCheckInTest.spec.cy.js --browser chrome

Now We are going to run complete project using simple cmd...
Please use this Customize cmd to run complete Soute:
1. npx cypress run
For Specific Browser
1. npx cypress run --browser chrome
If you want to see the script test run on browser please use
1. npx cypress run --headed --browser chrome
If you want to run script on Dashboard
1. npm run test-dashboard

1st Run
npx cypress run --spec cypress/e2e/OnlineCheckInSettingsSuite --headed --browser chrome
2nd Run
npx cypress run --spec cypress/e2e/PreCheckInProcessSuite --headed --browser chrome

