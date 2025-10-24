// cypress/support/commands.ts

// Extend Cypress Chainable interface
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginWithRole(
        role: string,
        email: string,
        password: string
      ): Cypress.Chainable<Subject>;
    }
  }
}

// Add the command
Cypress.Commands.add(
  'loginWithRole',
  (role: string, email: string, password: string) => {
    // Go to roles page
    cy.visit('/roles');
    cy.contains('Welcome to FruitGuard').should('be.visible');

    // Click role button
    cy.contains('button', role, { timeout: 10000 }).click();

    // Wait for login page
    cy.url().should('include', `/Login?role=${role.toLowerCase()}`);

    // Fill form
    cy.get('[data-cy="email"]', { timeout: 10000 }).type(email);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="login-btn"]').click();

    // Optional: wait for admin dashboard
    if (role.toLowerCase() === 'admin') {
      cy.url().should('include', '/farmer-registration');
    }
  }
);

// cypress/support/commands.ts
Cypress.Commands.add('loginWithRole', (role, email, password) => {
  cy.visit('/roles', { timeout: 15000 });
  cy.contains('Welcome to FruitGuard', { timeout: 10000 }).should('be.visible');
  cy.contains('button', role, { timeout: 10000 }).click({ force: true });
  cy.url().should('include', `/Login?role=${role.toLowerCase()}`);

  // Debug: Log login page HTML
  cy.document().then(doc => cy.log('Login Page HTML:', doc.body.innerHTML.substring(0, 1000)));

  // Try multiple selectors for email, password, and login button
  cy.get('input[placeholder*="email" i], input[name="email"], input[type="email"], input[id="email"]', { timeout: 15000 })
    .should('be.visible')
    .type(email, { force: true });
  cy.get('input[placeholder*="password" i], input[name="password"], input[type="password"], input[id="password"]', { timeout: 15000 })
    .should('be.visible')
    .type(password, { force: true });
  cy.get('button:contains("Log in"), button:contains("Login"), button[type="submit"], [data-cy="login-btn"]', { timeout: 15000 })
    .click({ force: true });

  // Verify login success
  cy.url({ timeout: 15000 }).should('not.include', '/Login');
  cy.contains('Welcome', { timeout: 15000 }).should('be.visible'); // Adjust based on post-login page
});

export {};