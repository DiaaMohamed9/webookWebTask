const path = require('path');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
   watchForFileChanges: false,
   video: true,
   viewportWidth: 1920,
   viewportHeight: 1080,
   reporter: 'mochawesome',
   reporterOptions: {
      reportDir: process.env.REPORT_DIR || 'mochawesome-report',
      overwrite: true,
      html: false,
      json: true
   },
   screenshotsFolder: path.join(process.env.REPORT_DIR || 'mochawesome-report', 'assets'),
   screenshotOnRunFailure: true,
   chromeWebSecurity: false,
   firefoxGcInterval: {
      runMode: null,
      openMode: null,
   },
   retries: {
      runMode: 2,
      openMode: 0,
   },
   execTimeout: 60000,
   defaultCommandTimeout: 10000,
   pageLoadTimeout: 60000,
   requestTimeout: 10000,
   responseTimeout: 30000,

   e2e: {
      setupNodeEvents(on, config) {
         return require('./cypress/plugins/index.js')(on, config);
      },
      testIsolation: false,
   },
});
