// cypress/e2e/farmer-registration.cy.ts
/// <reference types="cypress" />

describe('Farmer Registration Page (Live App – No Source Code)', () => {
  beforeEach(() => {
    cy.visit('/farmer-registration');
  });

  // Test 1: Table loads
  it('loads the table with farmer data', () => {
    cy.contains("Farmer's Registration").should('be.visible');

    const headers = ['Farmer', 'Phone number', 'No. of traps', 'Location', 'Details'];
    headers.forEach(h => cy.contains('th', h).should('be.visible'));

    cy.contains('Loading data...', { timeout: 20000 }).should('not.exist');
    cy.get('table tbody tr').should('have.length.gte', 1);
  });

  // Test 2: Click "Details" button (text button, no icon)
  it('opens farmer details when clicking the Details button', () => {
    cy.contains('Loading data...', { timeout: 20000 }).should('not.exist');

    // Find first row → last cell → click the button with text "Details"
    cy.get('table tbody tr')
      .first()
      .find('td')
      .last()
      .within(() => {
        cy.contains('button', 'Details').click({ force: true });
      });

    // Modal opens — look for any dialog
    cy.get('body').then($body => {
      if ($body.find('[role="dialog"]').length > 0) {
        cy.get('[role="dialog"]').should('be.visible');
      } else if ($body.find('.MuiDialog-root').length > 0) {
        cy.get('.MuiDialog-root').should('be.visible');
      } else {
        cy.get('div').contains('Farmer Details').should('be.visible');
      }
    });
  });

  // Test 3: Search works
  it('filters farmers and shows "No farmers found"', () => {
    cy.contains('Loading data...', { timeout: 20000 }).should('not.exist');

    // Find the search input by placeholder
    cy.get('input[placeholder*="Search"], input[placeholder*="farmer"]')
      .clear()
      .type('NonExistentFarmer123');

    cy.contains('No farmers found', { timeout: 8000 }).should('be.visible');

    // Clear search
    cy.get('input[placeholder*="Search"], input[placeholder*="farmer"]')
      .clear();

    cy.contains('Loading data...', { timeout: 15000 }).should('not.exist');
    cy.get('table tbody tr').should('have.length.gte', 1);
  });
});