describe('FruitGuard Splash Page', () => {
 beforeEach(() => {
   cy.visit('/')
   cy.wait(1000)
 })
 it('loads splash page successfully', () => {
   cy.title().should('contain', 'FruitGuard')
   cy.get('body').should('be.visible')
 })
 it('displays FruitGuard logo', () => {
   cy.get('img[alt="FruitGuard logo"]').should('be.visible')
   cy.get('img[src*="fruitguard.png"]').should('be.visible')
 })


 it('displays main title "FruitGuard"', () => {
   cy.contains('h1', 'FruitGuard').should('be.visible')
   cy.get('h1').should('have.class', 'text-[#FFC661]')
 })


 it('displays description text', () => {
   cy.contains('Monitor trap fill status').should('be.visible')
   cy.contains('real-time alerts').should('be.visible')
   cy.contains('IoT technology').should('be.visible')
 })


 it('displays "Get Started" button', () => {
   cy.contains('button', 'Get Started').should('be.visible')
   cy.get('button').contains('Get Started').should('have.class', 'rounded-xl')
 })


 it('clicks "Get Started" navigates to /roles', () => {
   cy.get('a[href="/roles"]').click()
   cy.url().should('include', '/roles')
 })


 it('applies correct background styling', () => {
   cy.get('[class*="bg-[url"]').should('exist')
   cy.get('[class*="bg-[#683929]/70"]').should('exist')
 })
 it('redirects authenticated admin to /home', () => {
   cy.window().then((win) => {
     win.localStorage.setItem('authToken', 'fake-token')
     win.localStorage.setItem('userRole', 'admin')
   })
  
   cy.visit('/')
   cy.url().should('include', '/home')
 })


 it('redirects authenticated agrovet to /farmer-registration', () => {
   cy.window().then((win) => {
     win.localStorage.setItem('authToken', 'fake-token')
     win.localStorage.setItem('userRole', 'agrovet')
   })
  
   cy.visit('/')
   cy.url().should('include', '/farmer-registration')
 })


 it('stays on splash for unauthenticated user', () => {
   cy.window().then((win) => {
     win.localStorage.removeItem('authToken')
     win.localStorage.removeItem('userRole')
   })
  
   cy.visit('/')
   cy.url().should('eq', 'https://fruitguard-mocha.vercel.app/')
   cy.contains('FruitGuard').should('be.visible')
 })
 it('complete unauthenticated user flow', () => {
   cy.contains('FruitGuard').should('be.visible')
   cy.contains('button', 'Get Started').click()
   cy.url().should('include', '/roles')
 })
})

