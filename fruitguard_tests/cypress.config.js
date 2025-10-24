// const { defineConfig } = require("cypress");

// // module.exports = defineConfig({
// //   e2e: {
// //     setupNodeEvents(on, config) {
// //       // implement node event listeners here
// //     },
// //   },
// // });

// module.exports = {
//   e2e: {
//     baseUrl: 'https://fruitguard-mocha.vercel.app',
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
//   },
// };


// import { defineConfig } from 'cypress';

// export default defineConfig({
//   e2e: {
//     baseUrl: 'https://fruitguard-mocha.vercel.app',
//     viewportWidth: 1280,
//     viewportHeight: 800,
//   },
// });

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://fruitguard-mocha.vercel.app',
    setupNodeEvents(on, config) {
      // nothing needed here unless you add plugins
    },
  },
});