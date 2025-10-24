/// <reference types="cypress" />

describe('FruitGuard – Role Selection → Login → Admin Dashboard', () => {
  // Helper to select role (no command needed)
  const selectRole = (roleText: string) => {
    cy.visit('/roles');
    cy.contains('Welcome to FruitGuard').should('be.visible');
    cy.contains('button', roleText, { timeout: 10000 }).click();
    cy.url().should('include', `/Login?role=${roleText.toLowerCase()}`);
  };

  // --------------------------------------------------------------
  // ADMIN FLOW
  // --------------------------------------------------------------
  context('Admin', () => {
    beforeEach(() => {
      selectRole('Admin');
    });

    it('logs in successfully and sees the farmer-registration table', () => {
      cy.loginWithRole('Admin', 'admin@fruitguard.com', 'adminpass123');

      cy.url().should('include', '/farmer-registration');

      // Table headers
      ;['Farmer', 'Phone number', 'No. of traps', 'Location', 'Details'].forEach((h) =>
        cy.contains('th', h).should('be.visible')
      );

      // Wait for data
      cy.contains('Loading data...', { timeout: 20000 }).should('not.exist');
      cy.get('table tbody tr').should('have.length.gte', 1);
    });

    it('shows error on invalid credentials', () => {
      cy.get('[data-cy="email"]').type('wrong@admin.com');
      cy.get('[data-cy="password"]').type('bad');
      cy.get('[data-cy="login-btn"]').click();

      cy.contains('Invalid credentials', { timeout: 8000 }).should('be.visible');
      cy.url().should('include', '/Login?role=admin');
    });

    it('shows validation errors when fields are empty', () => {
      cy.get('[data-cy="login-btn"]').click();
      cy.contains('Email is required', { timeout: 8000 }).should('be.visible');
      cy.contains('Password is required', { timeout: 8000 }).should('be.visible');
    });
  });

  // --------------------------------------------------------------
  // OTHER ROLES (e.g., Agrovet)
  // --------------------------------------------------------------
  context('Agrovet', () => {
    beforeEach(() => {
      selectRole('Agrovet');
    });

    it('logs in successfully', () => {
      cy.loginWithRole('Agrovet', 'agrovet@test.com', 'agrovet123');
      cy.url().should('include', '/agrovet/dashboard'); // adjust as needed
      cy.contains('Welcome, Agrovet').should('be.visible');
    });
  });
});