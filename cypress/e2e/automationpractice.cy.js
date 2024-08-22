// Importing page objects for better organization and readability
import Login from '../pageObjects/loginPage/login'
import Header from '../pageObjects/headerPage/header'
import Signup from '../pageObjects/signup/signup'
import Billing from '../pageObjects/billing/billing'
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
const billing = new Billing()

// Test suite for signup functionality
describe('Signup', function () {
   before('', () => {
      Cypress.on('uncaught:exception', () => {
         return false;
      });

      Cypress.session.clearAllSavedSessions()

      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.signup()

      Cypress.config('defaultCommandTimeout', 15000)

      // Code to execute before the tests in this suite
   })

   // beforeEach('', () => {
   //    // Restoring local storage to maintain state between tests
   //    cy.restoreLocalStorage()
   // })

   // it('test go to signup page', function () {
   //    email = `gdsfgfdgds4wt${faker.datatype.number({ min: 1000, max: 9000 })}`
   //    cy.customeVisit('https://webook.com/en').then(() => {
   //       header.loginProfileButton().should('be.visible').click()
   //       login.createAccountButton().should('be.visible').click()
   //       cy.saveLocalStorage()
   //    })
   // })
   // it('test signup flow', function () {
   //    signup.fillSigupForm()
   //    // header.successAlert().should('be.visible')
   // })
   it('test shop', function () {
      cy.xpath("(//*[contains(@class,'product-wrapper')])[1]/parent::*[@data-id]//ins//*[contains(@class,'woocommerce-Price-amount')]").should('be.visible').invoke('text')
         .then((text) => {
            cy.wrap(text).as('firstPrice');
         });
      cy.xpath("(//*[contains(@class,'product-wrapper')])[2]/parent::*[@data-id]//ins//*[contains(@class,'woocommerce-Price-amount')]").should('be.visible').invoke('text')
         .then((text) => {
            cy.wrap(text).as('secondPrice');
         });

      cy.xpath("(//*[contains(@class,'product-wrapper')])[1]/parent::*[@data-id]").should('be.visible').invoke('attr', 'data-id')
         .then((id) => {
            // Log the attribute value to the console for verification

            // Perform an assertion or further actions with the attribute value
            cy.wrap(id).as('firstProductId');
         });
      cy.xpath("(//*[contains(@class,'product-wrapper')])[2]/parent::*[@data-id]").should('be.visible').invoke('attr', 'data-id')
         .then((id) => {
            // Log the attribute value to the console for verification

            // Perform an assertion or further actions with the attribute value
            cy.wrap(id).as('secondProductId');
         });
      cy.xpath("(//*[contains(@class,'product-wrapper')])[1]/parent::*[@data-id]").click()
      cy.xpath('//*[@class="price"]//ins').should('be.visible').invoke('text')
         .then((text) => {
            cy.get("@firstPrice").then((expectedPrice) => {
               expect(text).to.be.eq(expectedPrice, `the expected price ${expectedPrice}   the actual ${text}`)
            })
         });
      cy.xpath(`//*[@data-value and contains(@class,'enabled')][1]`).click()
      cy.wait(1000)
      cy.xpath(`//button[@type="submit" and contains(text(),'Add to cart') and not (contains(@class,'disabled'))]`).click()
      cy.xpath(`//*[@class='widget_shopping_cart_content']//a[text()='View cart']`).should('be.visible')

      cy.visit('https://webook.com/shop/en/')
      cy.get("@secondProductId").then((id) => {
         cy.xpath(`//*[contains(@class,'product-wrapper')]/parent::*[@data-id=${id}]`).should('be.visible').click()
      }).then(() => {
         cy.xpath('//*[@class="price"]//ins').should('be.visible').invoke('text')
            .then((text) => {
               cy.get("@secondPrice").then((expectedPrice) => {
                  expect(text).to.be.eq(expectedPrice, `the expected price ${expectedPrice}   the actual ${text}`)
               })
            });
         cy.xpath(`//*[@data-value and contains(@class,'enabled')][1]`).click()
         cy.wait(1000)

         cy.xpath(`//button[@type="submit" and contains(text(),'Add to cart') and not (contains(@class,'disabled'))]`).click()
         cy.xpath(`//*[@class='widget_shopping_cart_content']//a[text()='View cart']`).should('be.visible')
         cy.xpath(`//*[@class='widget_shopping_cart_content']//p[contains(@class,'total')]//bdi`).should('be.visible').invoke('text')
            .then((text) => {
               cy.get("@firstPrice").then((expectedPrice1) => {
                  cy.get("@secondPrice").then((expectedPrice2) => {
                     let total = Number(text.replace("SAR", '').trim())
                     let expectedTotal = Number(expectedPrice1.replace("SAR", '').trim()) + Number(expectedPrice2.replace("SAR", '').trim())
                     expect(total).to.be.eq(expectedTotal, `the expected price ${expectedTotal}   the actual ${total}`)
                  })
               })
            });
         cy.xpath("//*[@class='widget_shopping_cart_content']//a[text()='Checkout']").click()
         billing.fillBillingForm()

      })




   })

})
