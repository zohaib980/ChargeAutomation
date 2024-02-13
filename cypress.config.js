const { defineConfig } = require('cypress');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  projectId: 'rbj641',
  reporter: 'cypress-mochawesome-reporter',
  // Customize HTML
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    reportFilename: "Report-[datetime]-report",
    timestamp: "longDate"
  },
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      //screenshotOnRunFailure=ture;
      // Report Generator 
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });
      // Customize HTML
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    retries: {
      runMode: 1,
      openMode: 0
    },
    baseUrl : '',
    "chromeWebSecurity": false,
    "pageLoadTimeout": 60000,
    "defaultCommandTimeout": 60000,
  },
});