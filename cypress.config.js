const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',

    supportFile: false,

    specPattern: 'cypress/e2e/**/*.cy.js',

    reporter: 'mochawesome',

    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },

    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    video: true,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      return config;
    }
  }
});