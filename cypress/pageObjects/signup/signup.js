import { faker } from '@faker-js/faker'

var selectors = require('./selectors')
var _ = require('lodash')
const moment = require('moment')

class signup {
   fillSigupForm() {
      let genratedData = this.generateSignupData()
      cy.writeFile('cypress/fixtures/genratedData.json', genratedData)
      this.firstName().type(genratedData.firstName)
      this.lastName().type(genratedData.lastName)
      cy.fixture('counter').then((data) => {
         let counter = data.counter;

         // Step 2: Increment the counter
         counter += 1;
         this.email().type(`mohamed${counter}@gmail.com`)
         this.confirmEmail().type(`mohamed${counter}@gmail.com`)

         cy.log(`Updated Counter: ${counter}`);

         // Step 3: Save the updated counter back to the file
         // You can't directly modify fixture files with Cypress commands, so we'll use Node.js code for this.
         cy.writeFile('cypress/fixtures/counter.json', { counter: counter });
      });

      this.password().type(genratedData.password)
      this.mobile().type(genratedData.mobile)
      this.agreeTerms().click({ force: true })
      this.submitButton().click()
      return { email: genratedData.email, password: genratedData.password }
   }
   firstName() {
      return cy.xpath(selectors.firstName)
   }
   lastName() {
      return cy.xpath(selectors.lastName)
   }
   email() {
      return cy.xpath(selectors.email)
   }
   confirmEmail() {
      return cy.xpath(selectors.confirmEmail)
   }

   submitButton() {
      return cy.xpath(selectors.submitButton)
   }
   password() {
      return cy.xpath(selectors.password)
   }
   mobile() {
      return cy.xpath(selectors.mobile)
   }
   agreeTerms() {
      return cy.xpath(selectors.agreeTerms)
   }
   generateRandomString(length) {
      let randomString = ''
      for (let i = 0; i < length; i++) {
         const randomNumber = faker.datatype.number({ min: 0, max: 9 })
         randomString += randomNumber.toString()
      }
      return randomString
   }
   generateSignupData() {
      return {
         email: faker.internet.email().toLowerCase().split("@")[0] + "42335@gmail.com",
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         mobile: '53' + this.generateRandomString(7),
         password: 'Test_Password_9',
         days: faker.datatype.number({ min: 1, max: 26 }),
         months: faker.datatype.number({ min: 1, max: 12 }),
         years: faker.datatype.number({ min: 2, max: 30 }),
      }
   }
}
export default signup
