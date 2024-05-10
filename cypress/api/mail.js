class email {
   createEmail(email) {
      return { email: email + '@tamatem.co', token: '' }
      cy.request({
         method: 'GET',
         url: `https://api.mail.tm/domains`,
         // headers: { Authorization: `Bearer ${token != '' ? token : bearertoken} ` },
         failOnStatusCode: false,
      })
         .then((response) => {
            expect(response.status).to.be.eq(200)
            let domain = response.body['hydra:member'][0]['domain']
            return `${email}@${domain}`
         })
         .then((email) => {
            cy.request({
               method: 'POST',
               url: `https://api.mail.tm/accounts`,
               body: {
                  address: email,
                  password: 'test1234s',
               },
               // headers: { Authorization: `Bearer ${token != '' ? token : bearertoken} ` },
               failOnStatusCode: false,
            })
               .then((response) => {
                  expect(response.status).to.be.eq(201)
               })
               .then(() => {
                  cy.request({
                     method: 'POST',
                     url: `https://api.mail.tm/token`,
                     body: {
                        address: email,
                        password: 'test1234s',
                     },
                     // headers: { Authorization: `Bearer ${token != '' ? token : bearertoken} ` },
                     failOnStatusCode: false,
                  }).then((response) => {
                     expect(response.status).to.be.eq(200)
                     let token = response.body['token']
                     return { email: email, token: token }
                  })
               })
         })
   }
   getMessages(token) {
      return cy
         .request({
            method: 'GET',
            url: `https://api.mail.tm/messages`,
            headers: { Authorization: `Bearer ${token} ` },
            failOnStatusCode: false,
         })
         .then((response) => {
            expect(response.status).to.be.eq(200)
            let messages = response.body['hydra:member']
            return messages
         })
   }
   getMessage(id, token) {
      return cy
         .request({
            method: 'GET',
            url: `https://api.mail.tm/messages/${id}`,
            headers: { Authorization: `Bearer ${token} ` },
            failOnStatusCode: false,
         })
         .then((response) => {
            expect(response.status).to.be.eq(200)
            let message = response.body['html'][0]
            return message
         })
   }
   getVerficationCode(token) {
      var data = []
      cy.wait(0)
         .then(() => {
            for (var counter = 0; counter < 5; counter++) {
               data = this.getMessages(token)
               if (len(data) > 0) {
                  break
               } else {
                  time.sleep(10)
                  counter += 1
               }
            }
         })
         .then(() => {
            messageId = data[0]['id']
            message = this.getMessage(messageId, token)
            return message
         })
         .then((message) => {
            // Define the regular expression pattern
            const regex = /\b\d{4}\b/g

            // Use the match method to find all matches
            const matches = message.match(regex)
            expect(matches.length).to.be.greaterThan(0)
            const lastMatch = matches[matches.length - 1]
            return lastMatch
         })
   }
   getResetLink(token) {
      var data = []
      cy.wait(0)
         .then(() => {
            for (var counter = 0; counter < 5; counter++) {
               data = this.getMessages(token)
               if (len(data) > 1) {
                  break
               } else {
                  time.sleep(10)
                  counter += 1
               }
            }
         })
         .then(() => {
            expect(data.length).to.be.greaterThan(1)
            messageId = data[0]['id']
            message = this.getMessage(messageId, token)
            return message
         })
         .then((message) => {
            // Define the regular expression pattern
            const regex =
               /(http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+\/password\/reset\/key\/[a-zA-Z0-9_-]+)/

            // Use the match method to find all matches
            const matches = message.match(regex)
            expect(matches.length).to.be.greaterThan(0)
            const lastMatch = matches[matches.length - 1]
            return lastMatch
         })
   }
}
export default email
