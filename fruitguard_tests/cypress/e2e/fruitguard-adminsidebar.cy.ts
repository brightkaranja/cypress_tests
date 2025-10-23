describe('FruitGuard Admin Sidebar', () => {
 beforeEach(() => {
   // Preserve session to prevent about:blank clearing localStorage
   cy.session('admin-session', () => {
     cy.clearLocalStorage();
     // Simulate admin login
     cy.visit('/Login?user_type=admin');
     cy.get('form').should('be.visible');
     cy.intercept('POST', '/api/login', {
       statusCode: 200,
       body: { token: 'fake-jwt-token', user_type: 'admin' },
     }).as('loginSuccess');
     cy.get('input[name="email"]').type('admin@fruitguard.com');
     cy.get('input[name="password"]').type('password123');
     cy.get('button').contains('Log In').click();
     cy.wait('@loginSuccess').its('response').should('have.property', 'body');
     cy.url().should('include', '/home', { timeout: 10000 });
     cy.window().then((win) => {
       win.localStorage.setItem('token', 'fake-jwt-token');
       win.localStorage.setItem('user_type', 'admin');
     });
   });


   // Mock RSC payload requests to suppress fetch errors for /team and /admin-profile
   cy.intercept('GET', '**/_rsc*', {
     statusCode: 200,
     body: '',
   }).as('rscMock');


   // Mock /team and /admin-profile routes to prevent 404s
   cy.intercept('GET', '/team', {
     statusCode: 200,
     body: '<div>Team Page</div>',
   }).as('teamPage');


   cy.intercept('GET', '/admin-profile', {
     statusCode: 200,
     body: '<div>Admin Profile Page</div>',
   }).as('adminProfilePage');


   // Visit home page to render AdminSidebar
   cy.visit('/home');
   cy.wait(1000); // Wait for page load
 });


 afterEach(() => {
   // Prevent about:blank issues
   cy.window().then((win) => {
     if (win.location.href.includes('about:blank')) {
       cy.visit('/home');
     }
   });
 });


 it('renders sidebar with logo and title', () => {
   cy.get('aside').should('be.visible');
   // Use data-cy if added, else use class
   // cy.get('[data-cy="admin-sidebar"]').should('be.visible');
   cy.get('img[alt="FruitGuard logo"]').should('be.visible');
   cy.contains('h1', 'FruitGuard').should('be.visible').should('have.class', 'text-[#FFC661]');
 });


 it('displays navigation links with correct active state', () => {
   cy.get('nav').within(() => {
     // Home link (active on /home)
     cy.contains('a', 'Home')
       .should('have.class', 'text-[#FFC661]')
       .find('svg')
       .should('have.class', 'w-10');
     cy.contains('a', 'Home').should('have.attr', 'href', '/home');


     // Manage Team link (inactive)
     cy.contains('a', 'Manage Team')
       .should('have.class', 'text-white')
       .find('svg')
       .should('have.class', 'w-10');
     cy.contains('a', 'Manage Team').should('have.attr', 'href', '/team');


     // Profile link (inactive)
     cy.contains('a', 'Profile')
       .should('have.class', 'text-white')
       .find('svg')
       .should('have.class', 'w-10');
     cy.contains('a', 'Profile').should('have.attr', 'href', '/admin-profile');
   });
 });


 it('navigates to team page when Manage Team link is clicked', () => {
   cy.get('nav').contains('a', 'Manage Team').click();
   cy.wait('@teamPage');
   cy.url().should('include', '/team', { timeout: 10000 });
   cy.contains('Team Page').should('be.visible'); // Mocked page content
   cy.get('nav').contains('a', 'Manage Team').should('have.class', 'text-[#FFC661]');
   cy.get('nav').contains('a', 'Home').should('have.class', 'text-white');
 });


 it('navigates to admin profile page when Profile link is clicked', () => {
   cy.get('nav').contains('a', 'Profile').click();
   cy.wait('@adminProfilePage');
   cy.url().should('include', '/admin-profile', { timeout: 10000 });
   cy.contains('Admin Profile Page').should('be.visible'); // Mocked page content
   cy.get('nav').contains('a', 'Profile').should('have.class', 'text-[#FFC661]');
   cy.get('nav').contains('a', 'Home').should('have.class', 'text-white');
 });


 it('shows logout confirmation modal when logout button is clicked', () => {
   cy.contains('button', 'Log out').click();
   cy.get('div.bg-white').should('be.visible');
   cy.contains('h2', 'Do you want to logout?').should('be.visible');
   cy.contains('button', 'Cancel').should('be.visible');
   cy.contains('button', 'Proceed').should('be.visible');
 });


 it('closes logout confirmation modal when Cancel is clicked', () => {
   cy.contains('button', 'Log out').click();
   cy.get('div.bg-white').should('be.visible');
   cy.contains('button', 'Cancel').click();
   cy.get('div.bg-white').should('not.exist');
 });


 it('logs out and navigates to login page when Proceed is clicked', () => {
   cy.contains('button', 'Log out').click();
   cy.get('div.bg-white').should('be.visible');
   cy.contains('button', 'Proceed').click();
   cy.url().should('include', '/Login', { timeout: 10000 });
   cy.window().then((win) => {
     expect(win.localStorage.getItem('token')).to.be.null;
     expect(win.localStorage.getItem('user_type')).to.be.null;
   });
 });
});

