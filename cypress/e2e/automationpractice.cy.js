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
const priceFirstProduct = "((//*[contains(@class,'product-wrapper')])[1]/parent::*[@data-id]//*[contains(@class,'woocommerce-Price-amount')])[last()]"
const priceSecondProduct = "((//*[contains(@class,'product-wrapper')])[2]/parent::*[@data-id]//*[contains(@class,'woocommerce-Price-amount')])[last()]"
const firstProductId = "(//*[contains(@class,'product-wrapper')])[1]/parent::*[@data-id]"
const secondProductId = "(//*[contains(@class,'product-wrapper')])[2]/parent::*[@data-id]"
const priceAtProductDetails = "(//*[@class='price']//*[contains(@class,'woocommerce-Price-amount')])[last()]"
const sizeAvailble = "//*[@data-value and contains(@class,'enabled')][1]"
const addToCartButtonEnabled = `//button[@type="submit" and contains(text(),'Add to cart') and not (contains(@class,'disabled'))]`
const viewCartButton = `//*[@class='widget_shopping_cart_content']//a[text()='View cart']`
const totalPriceAtSideCartDetials = `(//*[@class='widget_shopping_cart_content']//*[contains(@class,'total')]//*[translate(text(), '0123456789', '') != text()])[last()]` //get any elemnt contains digts 
const checkoutButton = `//*[@class='widget_shopping_cart_content']//a[text()='Checkout']`
// let counter
// Test suite for signup functionality
describe('Signup', function () {


   beforeEach('', () => {
      Cypress.on('uncaught:exception', () => {
         return false;
      });

      Cypress.session.clearAllSavedSessions()

      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.readFile('cypress/fixtures/counter.json').then((data) => {
         // let counter
         // counter = data.counter; // Read the counter from the file
         cy.signup(data.counter)
      });



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
      cy.wait(5000)
      cy.xpath(priceFirstProduct).should('be.visible').invoke('text')
         .then((text) => {
            cy.wrap(text).as('firstPrice');
         });
      cy.xpath(priceSecondProduct).should('be.visible').invoke('text')
         .then((text) => {
            cy.wrap(text).as('secondPrice');
         });

      cy.xpath(firstProductId).should('be.visible').invoke('attr', 'data-id')
         .then((id) => {
            // Log the attribute value to the console for verification

            // Perform an assertion or further actions with the attribute value
            cy.wrap(id).as('firstProductId');
         });
      cy.xpath(secondProductId).should('be.visible').invoke('attr', 'data-id')
         .then((id) => {
            // Log the attribute value to the console for verification

            // Perform an assertion or further actions with the attribute value
            cy.wrap(id).as('secondProductId');
         });
      cy.xpath(firstProductId).click()
      cy.xpath(priceAtProductDetails).should('be.visible').invoke('text')
         .then((text) => {
            cy.get("@firstPrice").then((expectedPrice) => {
               expect(text).to.be.eq(expectedPrice, `the expected price ${expectedPrice}   the actual ${text}`)
            })
         });
      cy.xpath(sizeAvailble).click()
      cy.wait(5000)
      cy.xpath(addToCartButtonEnabled).click()
      cy.xpath(viewCartButton).should('be.visible')

      cy.visit('https://webook.com/shop/en/')
      cy.get("@secondProductId").then((id) => {
         cy.xpath(`//*[contains(@class,'product-wrapper')]/parent::*[@data-id=${id}]`).should('be.visible').click()
      }).then(() => {
         cy.xpath(priceAtProductDetails).should('be.visible').invoke('text')
            .then((text) => {
               cy.get("@secondPrice").then((expectedPrice) => {
                  expect(text).to.be.eq(expectedPrice, `the expected price ${expectedPrice}   the actual ${text}`)
               })
            });
         cy.xpath(sizeAvailble).click()
         cy.wait(5000)

         cy.xpath(addToCartButtonEnabled).click()
         cy.xpath(viewCartButton).should('be.visible')
         cy.xpath(totalPriceAtSideCartDetials).should('be.visible').invoke('text')
            .then((text) => {
               cy.get("@firstPrice").then((expectedPrice1) => {
                  cy.get("@secondPrice").then((expectedPrice2) => {
                     let total = Number(text.replace("SAR", '').trim())
                     let expectedTotal = Number(expectedPrice1.replace("SAR", '').trim()) + Number(expectedPrice2.replace("SAR", '').trim())
                     cy.wrap(expectedTotal).as('expectedTotal');
                     expect(total).to.be.eq(expectedTotal, `the expected price ${expectedTotal}   the actual ${total}`)
                  })
               })
            });
         cy.xpath(checkoutButton).click()
         billing.fillBillingForm()


      })




   })

})
