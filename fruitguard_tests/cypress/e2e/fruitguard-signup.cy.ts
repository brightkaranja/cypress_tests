describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/roles');
    cy.contains('Welcome to FruitGuard').should('be.visible');
    cy.contains('button', 'Agrovet', { timeout: 10000 }).click();
    cy.url().should('include', '/Register?role=agrovet');
  });

  it('should render the registration form correctly', () => {
    cy.contains('h1', 'Sign Up').should('be.visible');
    cy.contains('h2', 'FruitGuard').should('be.visible');
    cy.get('img[alt="FruitGuard Logo"]').should('be.visible');

    cy.get('input[name="first_name"]').should('exist');
    cy.get('input[name="last_name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="phone_number"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirm_password"]').should('exist');

    cy.contains('button', 'Sign Up').should('be.visible');
    cy.contains('a', 'Log in').should('be.visible');
  });

  it('should toggle password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    cy.get('input[name="password"]')
      .parent()
      .find('button, svg')
      .first()
      .click();

    cy.get('input[name="password"]').should('have.attr', 'type', 'text');

    cy.get('input[name="password"]')
      .parent()
      .find('button, svg')
      .first()
      .click();

    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    cy.get('input[name="confirm_password"]').should('have.attr', 'type', 'password');

    cy.get('input[name="confirm_password"]')
      .parent()
      .find('button, svg')
      .first()
      .click();

    cy.get('input[name="confirm_password"]').should('have.attr', 'type', 'text');
  });

  it('should display error when passwords do not match', () => {
    cy.get('input[name="first_name"]').type('Bright');
    cy.get('input[name="last_name"]').type('Test');
    cy.get('input[name="email"]').type('bright@example.com');
    cy.get('input[name="phone_number"]').type('+254700123456');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm_password"]').type('password456');
    cy.contains('button', 'Sign Up').click();

    cy.url().should('include', '/Register');
    cy.get('input[name="confirm_password"]').should('exist');
  });

  
  it('should handle registration failure', () => {
    cy.intercept('POST', '/api/register*', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('registerRequest');

    cy.get('input[name="first_name"]').type('Bright');
    cy.get('input[name="last_name"]').type('Test');
    cy.get('input[name="email"]').type('bright@example.com');
    cy.get('input[name="phone_number"]').type('+254700123456');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm_password"]').type('password123');
    cy.contains('button', 'Sign Up').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/Register');
  });

  it('should prevent submission with missing required fields', () => {
    cy.contains('button', 'Sign Up').click();
    cy.url().should('include', '/Register');
    cy.get('input:invalid').should('have.length.at.least', 1);
  });

  it('should navigate to login page when clicking login link', () => {
    cy.contains('a', 'Log in').click();
    cy.url().should('include', '/Login');
  });

  it('should handle successful registration and redirect to login', () => {
    cy.intercept('POST', '/api/register*', {
      statusCode: 201,
      body: { message: 'User created successfully' },
    }).as('registerRequest');

    cy.get('input[name="first_name"]').type('Bright');
    cy.get('input[name="last_name"]').type('Test');
    cy.get('input[name="email"]').type('bright@example.com');
    cy.get('input[name="phone_number"]').type('+254700123456');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm_password"]').type('password123');
    cy.contains('button', 'Sign Up').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/Login');
  });

});
