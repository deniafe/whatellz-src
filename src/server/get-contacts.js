const { Client } = require('whatsapp-web.js')
const { nanoid } = require('nanoid')
// const { nanoid } = require('nanoid')

// Wait to receive message from the front end
let count = 0
process.on('message', (arg) => {
  const clearInt = {
    type: 'clearInt',
    title: 'Clear Interval',
  }
  process.send(clearInt)

  console.log('Count is now :', count)

  const account = arg.profile
  const showBrowser = arg.showBrowser

  if (!count) {
    count++
    console.log('Count in if statement :', count)
    // Use the saved values
    const client = new Client({
      puppeteer: { headless: !showBrowser },
      session: account.qrcode,
    })

    client.on('disconnected', (reason) => {
      let authAlert = {
        type: 'alert',
        info: 'error',
        status: 'error',
        title: `Bot has been disconnected`,
        message: `There was an error connecting whatsapp web- ${reason}`,
      }
      process.send(authAlert)
      let terminateAlert = {
        type: 'terminate',
      }
      process.send(terminateAlert)
    })

    client.on('auth_failure', (message) => {
      let authAlert = {
        type: 'alert',
        info: 'error',
        status: 'error',
        title: `Authentication Failed`,
        message: `There was an error during authentication - ${message}`,
      }
      process.send(authAlert)
      let terminateAlert = {
        type: 'terminate',
      }
      process.send(terminateAlert)
    })

    // Save session values to the file upon successful auth
    client.on('authenticated', () => {
      console.log('Authenticated')
    })

    client.on('ready', async () => {
      console.log('Client is ready!')
      const allContacts = await client.getContacts()
      const allUsers = allContacts.filter((user) => user.isUser)
      const users = allUsers.map((user) => {
        return {
          name: user.name || user.pushname,
          number: user.number,
          verified: false,
        }
      })

      const contactCollection = {
        id: nanoid(),
        name: `${account.name} Contacts`,
        numbers: users,
        verified: false,
      }

      process.send({
        type: 'wa-contacts-collection',
        title: 'Contact Collection',
        body: contactCollection,
      })

      console.log('Arguements sent to the background', arg)

      client.destroy()
    })

    client.initialize()
  }
  console.log('Count outside if statement :', count)
})
