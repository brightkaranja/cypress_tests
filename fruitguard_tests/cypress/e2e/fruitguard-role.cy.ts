describe('FruitGuard Roles Page', () => {
 beforeEach(() => {
   cy.visit('/roles')
   cy.wait(1000)
 })


 it('loads roles page successfully', () => {
   cy.url().should('include', '/roles')
 })


 it('displays FruitGuard logo', () => {
   cy.get('img[alt="FruitGuard logo"]').should('be.visible')
 })


 it('displays welcome title', () => {
   cy.contains('h2', 'Welcome to FruitGuard').should('be.visible')
 })


 it('displays description text', () => {
   cy.contains('An intelligent platform to monitor traps').should('be.visible')
 })


 it('displays Agrovet button', () => {
   cy.contains('button', 'Agrovet').should('be.visible')
 })


 it('displays Admin button', () => {
   cy.contains('button', 'Admin').should('be.visible')
 })


 it('clicks Agrovet button → navigates to Register', () => {
   cy.get('button').contains('Agrovet').click()
   cy.url().should('include', '/Register?role=agrovet')
 })


 it('clicks Admin button → navigates to Login', () => {
   cy.get('button').contains('Admin').click()
   cy.url().should('include', '/Login?role=admin')
 })


 it('buttons are clickable on mobile', () => {
   cy.viewport(375, 667)
   cy.get('button').contains('Agrovet').click()
   cy.url().should('include', '/Register')
 })
 it('complete Agrovet flow', () => {
   cy.contains('Welcome to FruitGuard').should('be.visible')
   cy.get('button').contains('Agrovet').click()
   cy.url().should('include', '/Register')
 })


 it('complete Admin flow', () => {
   cy.contains('Welcome to FruitGuard').should('be.visible')
   cy.get('button').contains('Admin').click()
   cy.url().should('include', '/Login')
 })
})

