// cypress/e2e/agrovet-profile.cy.ts
/// <reference types="cypress" />

describe('Agrovet Profile Page', () => {
  beforeEach(() => {
    // Optional: Uncomment to login as Agrovet
    // cy.loginWithRole('Agrovet', 'agrovet@test.com', 'agrovet123');
    cy.visit('/agrovet-profile');
  });

  it('loads the profile page and displays Agrovet data after loading', () => {
    // 1. Initial loading state
    cy.contains('h1', 'Profile').should('be.visible');
    cy.contains('Loading profile…').should('be.visible');

    // 2. Wait for loading to finish
    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');

    // 3. Profile sections (adjust based on real content)
    cy.contains('Personal Information').should('be.visible'); // Or 'Agrovet Details'
    cy.contains('Profile Photo').should('be.visible'); // If upload section exists

    // 4. Key fields (use real test data or inspect live page)
    cy.get('input[placeholder*="Name"], #name').should('have.value', 'Test Agrovet Co.');
    cy.get('input[placeholder*="Email"], #email').should('have.value', 'agrovet@test.com');
    cy.get('input[placeholder*="Phone"], #phone').should('have.value', '+1234567890');

    // 5. Agrovet stats
    cy.contains('Traps Managed:').should('be.visible'); // Adjust number/text
    cy.contains('Location:').should('be.visible');
  });

  it('allows editing and saving the Agrovet profile', () => {
    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');

    // 1. Click Edit button
    cy.contains('button', 'Edit Profile').click();

    // 2. Edit phone
    cy.get('input[placeholder*="Phone"]').clear().type('+1987654321');

    // 3. Save
    cy.contains('button', 'Save Changes').click();

    // 4. Verify update
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

  // File upload test (uncomment after setting up fixture)
  /*
  it('uploads a profile photo for the Agrovet', () => {
    cy.contains('Loading profile…', { timeout: 15000 }).should('not.exist');

    // Upload file
    cy.get('input[type="file"]').attachFile('test-photo.jpg');

    // Verify success
    cy.contains('Photo uploaded successfully').should('be.visible');
    cy.get('img[src*="profile"]').should('be.visible');
  });
  */
});