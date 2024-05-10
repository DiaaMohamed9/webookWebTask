import { faker } from '@faker-js/faker'

var selectors = require('./selectors')
var _ = require('lodash')
const moment = require('moment')

class Header {
   loginProfileButton() {
      return cy.xpath(selectors.loginProfileButton)
   }
   successAlert() {
      return cy.xpath(selectors.successAlert)
   }
   searchInput() {
      return cy.xpath(selectors.searchInput)
   }
   eventsFilter() {
      return cy.xpath(selectors.eventsFilter)
   }

   myProfileButtonButton() {
      return cy.xpath(selectors.myProfileButton)
   }
}
export default Header
