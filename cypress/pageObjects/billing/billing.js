import { faker } from '@faker-js/faker'
var selectors = require('./selectors')
const subTotal = `(//*[@class='cart-subtotal']//*[translate(text(), '0123456789', '') != text()])[last()]`
const total = `(//*[@class='order-total']//*[contains(@class,'woocommerce-Price-amount')]//*[translate(text(), '0123456789', '') != text()])[last()]`
const shippingFees = `(//*[@class='cart-shipping']//*[contains(@class,'woocommerce-Price-amount')]//*[translate(text(), '0123456789', '') != text()])[last()]`
class Billing {
   fillBillingForm() {
      let billingData = this.generateBillingData()
      cy.writeFile('cypress/fixtures/billingData.json', billingData)
      this.billingFirstName().type(billingData.firstName)
      this.billingLastName().type(billingData.lastName)
      this.billingAddress().type(billingData.address)
      this.billingAdditionalAddress().type(billingData.billingAdditionalAddress)
      this.billingCity().type(billingData.city)
      this.billingState().type(billingData.state)
      this.billingPhone().type(billingData.phone)
      this.billingEmail().clear().type(billingData.email)
      cy.wait(4000)
      cy.xpath(subTotal).invoke('text')
         .then((text) => {
            cy.get("@expectedTotal").then((expectedTotal) => {
               expect(Number(text.replace("SAR", '').trim())).to.be.eq(expectedTotal, `the expected price ${expectedTotal}   the actual ${text.replace("SAR", '').trim()}`)
            })
         });
      cy.xpath(total).invoke('text')
         .then((totalText) => {
            cy.xpath(shippingFees).invoke('text')
            .then((shippingText) => {
               cy.get("@expectedTotal").then((expectedTotal) => {
               expectedTotal=expectedTotal+ Number(shippingText.replace("SAR", '').trim())//add shipping fees
                  expect(Number(totalText.replace("SAR", '').trim())).to.be.eq(expectedTotal, `the expected price ${expectedTotal}   the actual ${totalText.replace("SAR", '').trim()}`)
               })
            })

         });

      this.billingSubmit().click()
      cy.wait(4000)
      cy.xpath(`//*[text()='Card Number']`).should('be.visible')


   }

   billingFirstName() {
      return cy.xpath(selectors.billingFirstName)
   }

   billingLastName() {
      return cy.xpath(selectors.billingLastName)
   }

   billingAddress() {
      return cy.xpath(selectors.billingAddress)
   }
   billingAdditionalAddress() {
      return cy.xpath(selectors.billingAdditionalAddress)
   }

   billingCity() {
      return cy.xpath(selectors.billingCity)
   }

   billingState() {
      return cy.xpath(selectors.billingState)
   }

   billingPhone() {
      return cy.xpath(selectors.billingPhone)
   }

   billingEmail() {
      return cy.xpath(selectors.billingEmail)
   }
   billingSubmit() {
      return cy.xpath(selectors.billingSubmit)
   }


   generateBillingData() {
      return {
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         address: faker.address.streetAddress(),
         billingAdditionalAddress:faker.address.streetAddress(),
         city: faker.address.city(),
         state: faker.address.state(),
         phone: '5' + this.generateRandomString(8),
         email: faker.internet.email(),
      }
   }

   generateRandomString(length) {
      let randomString = ''
      for (let i = 0; i < length; i++) {
         const randomNumber = faker.datatype.number({ min: 0, max: 9 })
         randomString += randomNumber.toString()
      }
      return randomString
   }
}

export default Billing
