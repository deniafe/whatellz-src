const { Client } = require('whatsapp-web.js')
const { nanoid } = require('nanoid')

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

      let numbersCollections = []

      // Get all chats and filter out the one that is a group chat
      const chats = await client.getChats()
      const groups = chats.filter((chat) => chat.isGroup)

      let participants

      // Cycle through all the chats and get all the participants of the chats
      for (let i = 0; i < groups.length - 1; i++) {
        participants = groups[i].participants
        console.log(groups[i].name)
        let participant
        let number
        let membersNumbers = []
        for (let x = 0; x < participants.length - 1; x++) {
          participant = participants[x]
          number = participant.id._serialized.replace('@c.us', '')
          membersNumbers.push({
            name: 'n/a',
            number,
            verified: false,
          })
          console.log(participant)
        }
        console.log(`Group has ${membersNumbers.length} participants`)

        numbersCollections.push({
          id: nanoid(),
          name: groups[i].name,
          numbers: membersNumbers,
          verified: false,
        })
        // console.log(membersNumbers)
      }
      // console.log(participants)

      process.send({
        type: 'wa-group-collection',
        title: 'Group Collection',
        body: numbersCollections,
      })

      client.destroy()
    })

    client.initialize()
  }
  console.log('Count outside if statement :', count)
})
