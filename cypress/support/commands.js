// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import Login from '../pageObjects/loginPage/login'
import Header from '../pageObjects/headerPage/header'
import Signup from '../pageObjects/signup/signup'
const login = new Login()
const header = new Header()
const signup = new Signup()
import "cypress-wait-until";
Cypress.Commands.add('customeVisit', (url) => {
  cy.window().then((win) => {
    win.location.href = url;
  });
});
Cypress.Commands.add('signup', (counterr) => {


  cy.session(
    [],
    () => {
      cy.intercept('POST', 'https://api.webook.com/api/v2/register**').as('registerApi');

      cy.visit('https://webook.com/en/login')
      login.createAccountButton().should('be.visible').click()
      signup.fillSigupForm(counterr)
    },
    {
      validate() {
        cy.wait('@registerApi').then((interception) => {
          const { statusCode, body } = interception.response;
        
          // Check that the status code is 200
          expect(statusCode).to.eq(200);
        
          // Ensure that the response body does not have an error
          expect(body).to.not.have.property('error');
          expect(body.status).to.not.eq('error');
          // Optionally, you can check for specific error cases if needed
          expect(body.error?.user).to.not.equal("User Already exists");
        });  
        
        cy.visit('https://webook.com/shop/en/')
        cy.xpath("//a[contains(@href,'/my-account') and *[contains(text(),'My Account')]]").should('be.visible')


      },
    }
  )
})