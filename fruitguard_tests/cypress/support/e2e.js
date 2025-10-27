import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('e.filter is not a function')) {
    return false;
  }
  return true;
});