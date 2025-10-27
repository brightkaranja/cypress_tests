const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://fruitguard-mocha.vercel.app',
    setupNodeEvents(on, config) {
    },
  },
});