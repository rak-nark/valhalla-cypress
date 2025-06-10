const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://74.235.100.236",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
