import { faker } from '@faker-js/faker'

var selectors = require('./selectors')
var _ = require('lodash')
const moment = require('moment')

class mainPage {
   tutorialSkipButton() {
      return cy.xpath(selectors.tutorialSkipButton)
   }
   closeButton() {
      return cy.xpath(selectors.closeButton)
   }
}
export default mainPage
