const { defineConfig } = require('cypress')

module.exports = defineConfig({
   watchForFileChanges: false,
   video: true,
   viewportWidth: 1920,
   viewportHeight: 1080,
   reporter: '../node_modules/mochawesome/src/mochawesome.js',
   reporterOptions: {
      overwrite: false,
      html: false,
      json: true,
   },
   screenshotsFolder: 'TestReport/assets',
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
   chromeWebSecurity: false,
   execTimout: 60000,
   defaultCommandTimeout: 10000,
   pageLoadTimeout: 60000,
   requestTimeout: 10000,
   responseTimeout: 30000,

   e2e: {
      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      setupNodeEvents(on, config) {
         return require('./cypress/plugins/index.js')(on, config)
      },
      testIsolation: false,
   },
})
