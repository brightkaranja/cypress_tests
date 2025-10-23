/// <reference types="cypress" />
describe('template spec', () => {
 it('passes', () => {
   cy.visit('https://fruitguard-mocha.vercel.app')
 })
})


describe('Farmers Registration Page E2E Tests (Homepage)', () => {
 beforeEach(() => {
   // Visit the farmers registration page (adjust baseUrl in cypress.config.ts if needed)
   cy.visit('/farmer-registration');  // Or '/register' based on routing


   // Wait for initial load and API fetch (intercept if needed)
   cy.intercept('GET', '**/api/users/**').as('getUsers');
   cy.wait('@getUsers', { timeout: 10000 });
 });


 // 1. PAGE LOAD & TITLE
 it('Loads the page and verifies main title "Farmer\'s Registration"', () => {
   cy.title().should('include', 'Farmer\'s Registration');
   cy.get('h1').should('contain.text', "Farmer's Registration").and('have.css', 'color', 'rgb(123, 63, 48)');  // #7B3F30
 });


 // 2. SEARCH INPUT: LOAD, TYPE, FILTER
 it('Verifies search input exists with correct placeholder and icon', () => {
   cy.get('input[placeholder="Search by name or phone number"]').should('be.visible').and('have.class', 'pl-10');
   cy.get('[data-icon="search"]').should('be.visible');  // FaSearch icon
 });


 it('Types in search bar, filters results, and resets', () => {
   // Assume sample data loads (from API intercept)
   cy.get('input[placeholder="Search by name or phone number"]').type('Ann');  // Example from screenshot
   cy.get('tbody tr').should('have.length.at.most', 1);  // Filters to matching rows
   cy.contains('Ann Ngugi').should('be.visible');  // Specific filter match


   // Clear search
   cy.get('input[placeholder="Search by name or phone number"]').clear().type('{enter}');
   cy.get('tbody tr').should('have.length.greaterThan', 0);  // Back to full list
 });


 it('Searches for non-existent term and shows "No farmers found"', () => {
   cy.get('input[placeholder="Search by name or phone number"]').type('NonExistent');
   cy.contains('No farmers found').should('be.visible');
   cy.get('tbody tr').should('have.length', 0);
 });


 // 3. +REGISTER BUTTON: CLICK & MODAL OPEN
 it('Verifies +Register button exists with icon and opens modal', () => {
   cy.get('button').contains('Register').should('be.visible').and('have.class', 'py-3');
   cy.get('[data-icon="plus"]').should('be.visible');  // FaPlus icon


   cy.get('button').contains('Register').click();
   cy.get('form').should('be.visible').and('have.class', 'w-[500px]');  // Modal form
   cy.contains('Register Farmer').should('be.visible');
 });


 // 4. REGISTER FARMER MODAL: FORM FIELDS & SUBMIT
 it('Fills and submits Register Farmer modal form successfully', () => {
   cy.get('button').contains('Register').click();


   // Fill all fields
   cy.get('#firstName').type('Test');
   cy.get('#lastName').type('Farmer');
   cy.get('#phone').type('0720000000');
   cy.get('#location').type('Nairobi');
   cy.get('#numberOfTraps').type('10');


   // Intercept POST for addFarmers
   cy.intercept('POST', '**/api/users/', { statusCode: 201, body: { id: 999, first_name: 'Test', last_name: 'Farmer', /* ... */ } }).as('postFarmer');


   // Submit
   cy.get('button').contains('Register').click();
   cy.wait('@postFarmer').its('response.statusCode').should('eq', 201);


   // Verify success snackbar
   cy.get('.MuiSnackbar-root').should('be.visible');
   cy.contains('Farmer registered successfully!').should('be.visible');


   // Close modal
   cy.get('button').contains('Cancel').click();
   cy.get('form').should('not.exist');
 });


 it('Handles Register Farmer form validation errors', () => {
   cy.get('button').contains('Register').click();


   // Submit empty form
   cy.get('button').contains('Register').click();


   // Verify required fields error (browser native or custom)
   cy.get('#firstName').should('have.attr', 'validationMessage').and('include', 'required');
   cy.get('button').contains('Cancel').click();
 });


 // 5. TABLE: HEADERS & LOADING STATE
 it('Verifies all 5 table headers with styling', () => {
   cy.get('thead th').should('have.length', 5);
   cy.get('thead th').eq(0).should('contain.text', 'Farmer').and('have.css', 'background-color', 'rgb(123, 63, 48)');
   cy.get('thead th').eq(1).should('contain.text', 'Phone number');
   cy.get('thead th').eq(2).should('contain.text', 'No. of traps');
   cy.get('thead th').eq(3).should('contain.text', 'Location');
   cy.get('thead th').eq(4).should('contain.text', 'Details');
 });


 it('Shows loading state during data fetch', () => {
   cy.intercept('GET', '**/api/users/**', { delay: 2000 }).as('slowUsers');
   cy.reload();
   cy.wait('@slowUsers');
   cy.contains('Loading data...').should('be.visible').and('have.class', 'text-center');
 });


 // 6. TABLE ROWS: SAMPLE DATA & VIEW BUTTON
 it('Verifies sample farmer row data and View button', () => {
   // Assume API returns sample data like screenshot
   cy.get('tbody tr').should('have.length.greaterThan', 0);
   cy.get('tbody tr').first().within(() => {
     cy.get('td').eq(0).should('contain.text', 'Ann Ngugi');  // Example
     cy.get('td').eq(1).should('contain.text', '0723456786');
     cy.get('td').eq(2).should('contain.text', '12').and('have.class', 'font-bold');
     cy.get('td').eq(3).should('contain.text', 'Karen');
     cy.get('button').contains('View').should('be.visible').and('have.class', 'py-3');
   });
 });


 it('Clicks View button and opens Farmer Details modal', () => {
   cy.get('tbody tr').first().within(() => {
     cy.get('button').contains('View').click();
   });


   // Modal opens
   cy.get('.bg-white.rounded-xl').should('be.visible').and('have.class', 'w-[500px]');
   cy.contains('Farmer details').should('be.visible');
   cy.contains('Ann Ngugi').should('be.visible');  // Name from row
 });


 // 7. FARMER DETAILS MODAL: CONTENT & ADD DEVICE
 it('Verifies Farmer Details modal content and registered devices list', () => {
   cy.get('tbody tr').first().within(() => {
     cy.get('button').contains('View').click();
   });


   // Details
   cy.get('div.font-semibold').should('contain.text', 'Ann Ngugi');  // Name
   cy.contains('0723456786').should('be.visible');  // Phone
   cy.contains('Karen').should('be.visible');  // Location


   // Devices section
   cy.contains('Registered devices').should('be.visible');
   cy.get('ul li').should('contain.text', 'No devices registered');  // Or actual if loaded


   // Intercept devices fetch
   cy.intercept('GET', '**/api/devices/**').as('getDevices');
   cy.wait('@getDevices');
 });


 it('Clicks "Add device" in Details modal and opens Add Device sub-modal', () => {
   cy.get('tbody tr').first().within(() => {
     cy.get('button').contains('View').click();
   });
   cy.get('button').contains('Add device').click();


   // Sub-modal opens
   cy.get('form').should('be.visible').and('have.class', 'w-[400px]');
   cy.contains('Add Device').should('be.visible');
   cy.get('input[placeholder="Enter device identifier"]').should('be.visible');
 });


 it('Fills and submits Add Device form successfully', () => {
   cy.get('tbody tr').first().within(() => {
     cy.get('button').contains('View').click();
   });
   cy.get('button').contains('Add device').click();


   // Fill form
   cy.get('input[placeholder="Enter device identifier"]').type('ESP32-Test-001');


   // Intercept POST for addDevice
   cy.intercept('POST', '**/api/devices/', { statusCode: 201, body: { device_id: 999, device_identifier: 'ESP32-Test-001', status: 'active' } }).as('postDevice');


   // Submit
   cy.get('button').contains('Add').click();
   cy.wait('@postDevice').its('response.statusCode').should('eq', 201);


   // Close modals
   cy.get('button').contains('Close').click();
   cy.get('.bg-white.rounded-xl').should('not.exist');
 });


 // 8. PAGINATION: BUTTONS, TEXT, NAVIGATION
 it('Verifies pagination when multiple pages exist', () => {
   // Assume >8 farmers for multi-page
   cy.get('span').contains('Page 1 of 2').should('be.visible');  // Example


   // Previous disabled on page 1
   cy.get('button').contains('Previous').should('be.disabled').and('have.class', 'bg-gray-400');


   // Next enabled
   cy.get('button').contains('Next').should('not.be.disabled').click();
   cy.contains('Page 2 of 2').should('be.visible');
   cy.get('tbody tr').should('exist');  // Data loads


   // Go back
   cy.get('button').contains('Previous').click();
   cy.contains('Page 1 of 2').should('be.visible');
 });


 it('Hides pagination when single page', () => {
   // Mock API to return <8 farmers
   cy.intercept('GET', '**/api/users/**', { body: { results: Array.from({ length: 5 }, (_, i) => ({ id: i, user_type: 'farmer' })) } });
   cy.reload();
   cy.get('.paginations').should('not.exist');
 });


 // 9. SNACKBAR: SUCCESS/ERROR NOTIFICATIONS
 it('Shows success snackbar after registration', () => {
   // From register test, but isolated
   cy.get('button').contains('Register').click();
   cy.get('#firstName').type('Test');
   // ... fill as before
   cy.get('button').contains('Register').click();
   cy.get('.MuiAlert-root').should('have.class', 'backgroundColor').and('include', '#0F5736');  // Success color
   cy.get('button[aria-label="close"]').click();  // Close
 });


 it('Shows error snackbar on API failure', () => {
   cy.intercept('POST', '**/api/users/', { statusCode: 400, body: { message: 'Duplicate phone' } }).as('errorPost');
   cy.get('button').contains('Register').click();
   cy.get('#phone').type('0720000000');  // Duplicate example
   cy.get('button').contains('Register').click();
   cy.wait('@errorPost');
   cy.contains('Farmer already exists').should('be.visible');  // Error message
 });


 // 10. ERROR HANDLING: API FAIL
 it('Handles users API error and shows error message', () => {
   cy.intercept('GET', '**/api/users/**', { statusCode: 500 }).as('errorUsers');
   cy.reload();
   cy.wait('@errorUsers');
   cy.contains('text-red-500').should('be.visible');  // Error div
   cy.get('tbody tr').should('have.length', 0);
 });


 // 11. FULL PAGE INTERACTIONS: END-TO-END FLOW
 it('Complete flow: Search > View Details > Add Device > Register New > Snackbar', () => {
   // Search
   cy.get('input[placeholder="Search by name or phone number"]').type('Ann');
   cy.get('tbody tr').first().within(() => {
     cy.get('button').contains('View').click();
   });


   // Add device
   cy.get('button').contains('Add device').click();
   cy.get('input[placeholder="Enter device identifier"]').type('TestDevice');
   cy.get('button').contains('Add').click();


   // Close details
   cy.get('button').contains('Close').click();


   // Register new
   cy.get('input[placeholder="Search by name or phone number"]').clear();
   cy.get('button').contains('Register').click();
   cy.get('#firstName').type('New');
   cy.get('#lastName').type('Test');
   cy.get('#phone').type('0710000000');
   cy.get('#location').type('TestLocation');
   cy.get('#numberOfTraps').type('5');
   cy.get('button').contains('Register').click();


   // Verify snackbar
   cy.contains('Farmer registered successfully!').should('be.visible');
 });
});

