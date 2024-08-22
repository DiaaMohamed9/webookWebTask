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
Cypress.Commands.add('signup', () => {


  cy.session(
    [],
    () => {
      cy.intercept('POST', 'https://api.webook.com/api/v2/register**').as('registerApi');

      cy.visit('https://webook.com/en/login')
      login.createAccountButton().should('be.visible').click()
      signup.fillSigupForm()
      cy.wait('@registerApi').its('response.statusCode').should('eq', 200);
    },
    {
      validate() {
        cy.visit('https://webook.com/shop/en/')
        cy.xpath("//a[@title='My account']").should('be.visible')

      },
    }
  )
})