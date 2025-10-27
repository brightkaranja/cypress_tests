
/// <reference types="cypress" />

describe('Agrovet Profile Page', () => {
  beforeEach(() => {
 
    cy.visit('/agrovet-profile');
  });

  it('loads the profile page and displays Agrovet data after loading', () => {
  
    cy.contains('h1', 'Profile').should('be.visible');
    cy.contains('Loading profile…').should('be.visible');

    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');


    cy.contains('Personal Information').should('be.visible'); 
    cy.contains('Profile Photo').should('be.visible'); 

    cy.get('input[placeholder*="Name"], #name').should('have.value', 'Test Agrovet Co.');
    cy.get('input[placeholder*="Email"], #email').should('have.value', 'agrovet@test.com');
    cy.get('input[placeholder*="Phone"], #phone').should('have.value', '+1234567890');

    cy.contains('Traps Managed:').should('be.visible');
    cy.contains('Location:').should('be.visible');
  });

  it('allows editing and saving the Agrovet profile', () => {
    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');

    cy.contains('button', 'Edit Profile').click();

    cy.get('input[placeholder*="Phone"]').clear().type('+1987654321');

    cy.contains('button', 'Save Changes').click();

    cy.get('input[placeholder*="Phone"]').should('have.value', '+1987654321');
    cy.contains('Profile updated successfully').should('be.visible', { timeout: 5000 });
  });

  it('shows validation errors on empty or invalid fields', () => {
    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');

    cy.contains('button', 'Edit Profile').click();
    cy.get('input[placeholder*="Name"]').clear();
    cy.get('input[placeholder*="Email"]').clear();
    cy.contains('button', 'Save Changes').click();

    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Valid email format required').should('be.visible');
  });

});