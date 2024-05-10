// Importing page objects for better organization and readability
import Login from '../pageObjects/loginPage/login'
import Header from '../pageObjects/headerPage/header'
import Signup from '../pageObjects/signup/signup'
import Mail from '../api/mail'
import { faker } from '@faker-js/faker'

// Moment.js library for date/time manipulation
const moment = require('moment')
// Variables to store user credentials
var email = ''
var password = ''

// Creating instances of page objects
const login = new Login()
const header = new Header()
const mail = new Mail()
const signup = new Signup()

// Test suite for signup functionality
describe('Signup', function () {
   before('', () => {
      cy.clearAllSessionStorage()
      cy.clearAllLocalStorage()
      cy.clearAllCookies()

      Cypress.config('defaultCommandTimeout', 15000)

      // Code to execute before the tests in this suite
   })

   beforeEach('', () => {
      // Restoring local storage to maintain state between tests
      cy.restoreLocalStorage()
   })

   it('test go to signup page', function () {
      email = `gdsfgfdgds4wt${faker.datatype.number({ min: 1000, max: 9000 })}`
      cy.customeVisit('https://webook.com/en').then(() => {
         header.loginProfileButton().should('be.visible').click()
         login.createAccountButton().should('be.visible').click()
         cy.saveLocalStorage()
      })
   })
   it('test signup flow', function () {
      signup.fillSigupForm()
      header.successAlert().should('be.visible')
   })
   it('test search by filter', function () {
      header.searchInput().should('be.visible').click()
      header.eventsFilter().should('be.visible').click()
      cy.url().should('include', 'type=events')
   })
})
