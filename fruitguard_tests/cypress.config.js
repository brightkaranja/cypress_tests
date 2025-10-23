const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

module.exports = {
  e2e: {
    baseUrl: 'https://fruitguard-mocha.vercel.app',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
};
