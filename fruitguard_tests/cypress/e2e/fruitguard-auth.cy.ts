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

describe("FruitGuard Login Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.visit("https://fruitguard-mocha.vercel.app/Login");
  });

  it("renders login UI correctly", () => {
    cy.contains("h1", "Log In").should("be.visible");
    cy.contains("h2", "FruitGuard").should("be.visible");

    cy.get('input[placeholder="Enter email"]').should("be.visible");
    cy.get('input[placeholder="Enter password"]').should("be.visible");

    cy.contains("button", "Log In").should("be.visible");
  
  });

  

  it("shows error toast for invalid credentials", () => {
    cy.get('input[placeholder="Enter email"]').type("wrong@example.com");
    cy.get('input[placeholder="Enter password"]').type("wrongpass");

    cy.contains("button", "Log In").click();
    cy.wait("@loginRequest");

    cy.contains(/invalid|incorrect/i);
    cy.url().should("include", "/Login");
  });

  it("prevents submission with empty fields", () => {
    cy.contains("button", "Log In").click();
    cy.url().should("include", "/Login");
  });

  it("navigates to Register page", () => {
    cy.contains("a", "Sign Up").click();
    cy.url().should("include", "/Register");
  });

  it("navigates to Forgot Password page", () => {
    cy.contains("a", "Forgot Password?").click();
    cy.url().should("include", "/ForgotPassword");
  });

  it("logs in successfully with required working credentials and redirects to farmer registration page", () => {
    const email = "marionkamu@gmail.com";
    const password = "12345";

    cy.get('input[placeholder="Enter email"]').type(email);
    cy.get('input[placeholder="Enter password"]').type(password);

    cy.contains("button", "Log In").click();
    cy.wait("@loginRequest");

    cy.url().should("include", "/farmer-registration");
  });
});

/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
  console.warn('Uncaught exception:', err.message);
  return false;
});

describe('Farmer Registration Flow', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

    cy.intercept('GET', '/api/farmers', {
      statusCode: 200,
      body: [
        { id: 1, first_name: 'Bright', last_name: 'Karanja', phone_number: '0765432178', location: 'Karen', number_of_traps: '12', user_type: 'farmer' },
        { id: 2, first_name: 'Carol', last_name: 'Khembo', phone_number: '0712345678', location: 'Nairobi', number_of_traps: '8', user_type: 'farmer' },
      ],
    }).as('getFarmers');

    cy.intercept('POST', '/api/farmers', (req) => {
      const { first_name, last_name, phone_number, location, number_of_traps, user_type } = req.body;
      if (!first_name || !last_name || !phone_number || !location || !number_of_traps || !user_type) {
        req.reply({ statusCode: 400, body: { error: 'Missing required fields' } });
      } else {
        req.reply({ statusCode: 201, body: { id: 999, ...req.body } });
      }
    }).as('postFarmers');

    cy.intercept('GET', '/api/device/', {
      statusCode: 200,
      body: [{ device_id: 1, device_identifier: 'ESP32-001', status: 'active', user_id: 1, created_at: '2025-10-23T07:48:00Z' }],
    }).as('getDevices');

    cy.intercept('POST', '/api/device/', (req) => {
      const { device_identifier, status, user_id } = req.body;
      if (!device_identifier || !status || !user_id) {
        req.reply({ statusCode: 400, body: { error: 'Missing device fields' } });
      } else {
        req.reply({ statusCode: 201, body: { device_id: 999, ...req.body, created_at: '2025-10-23T07:48:00Z' } });
      }
    }).as('postDevice');

    cy.visit('/farmer-registration', { timeout: 30000 });
    cy.wait('@getFarmers', { timeout: 30000 });
    cy.get('h1').should('contain.text', "Farmer's Registration");
  });

  it('Checks search input exists', () => {
    cy.get('input[placeholder="Search by name or phone number"]')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Search by name or phone number');
  });

  it('Filters farmers by name', () => {
    cy.get('input[placeholder="Search by name or phone number"]').type('Carol');
    cy.get('tbody tr').should('have.length', 1).and('contain.text', 'Carol Khembo');
    cy.get('input[placeholder="Search by name or phone number"]').clear();
    cy.get('tbody tr').should('have.length.gte', 2);
  });

  it('Displays "No farmers found" with invalid search', () => {
    cy.get('input[placeholder="Search by name or phone number"]').type('XYZ123');
    cy.contains('No farmers found').should('be.visible');
    cy.get('tbody tr').should('have.length', 1);
  });

  it('Opens registration modal', () => {
    cy.contains('button', 'Register').click();
    cy.get('form').should('be.visible');
    cy.contains('Register Farmer').should('be.visible');
  });

  it('Submits registration form successfully', () => {
    cy.contains('button', 'Register').click();
    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#phone').type('0720000000');
    cy.get('#location').type('Nairobi');
    cy.get('#numberOfTraps').type('5');
    cy.get('form').contains('button', 'Register').click();
    cy.wait('@postFarmers').its('response.statusCode').should('eq', 201);
    cy.contains('Farmer registered successfully!').should('be.visible');
  });

  it('Shows correct table headers', () => {
    cy.get('thead th').eq(0).should('contain.text', 'Farmer');
    cy.get('thead th').eq(1).should('contain.text', 'Phone number');
    cy.get('thead th').eq(2).should('contain.text', 'No. of traps');
    cy.get('thead th').eq(3).should('contain.text', 'Location');
    cy.get('thead th').eq(4).should('contain.text', 'Details');
  });

  it('Renders farmer list with View button', () => {
    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(0).should('contain.text', 'Carol Khembo');
      cy.get('button').contains('View').click();
    });
  });

  it('Opens farmer details modal', () => {
    cy.get('tbody tr').first().find('button').contains('View').click();
    cy.get('.bg-white.rounded-xl').should('be.visible');
    cy.contains('Carol Khembo').should('be.visible');
  });

  it('Adds device to farmer', () => {
    cy.get('tbody tr').first().find('button').contains('View').click();
    cy.contains('Add device').click();
    cy.get('input[placeholder="Enter device identifier"]').type('ESP32-NEW-01');
    cy.get('form').contains('button', 'Add').click({ force: true });
    cy.wait('@postDevice').its('response.statusCode').should('eq', 201);
    cy.contains('Close').click();
  });

});


