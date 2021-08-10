const fs = require('fs')
const { Client } = require('whatsapp-web.js')

// Path where the session data will be stored
const SESSION_FILE_PATH = `C:/Users/DEBBY/projects/Socio Toolz Projects/whattelz/src/server/session.json`
console.log('App is running')

// Load the session data if it has been previously saved
let sessionData
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH)
  console.log('session data')
}

// Use the saved values
const client = new Client({
  puppeteer: { headless: false },
  session: sessionData,
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
  sessionData = session
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err)
      console.log(err)
    }
  })
})

client.on('ready', async () => {
  console.log('Client is ready!')
  const numid = await client.getNumberId('2348035725391')
  console.log(numid)
  const contact = await client.getContactById('2348039571749@c.us')
  console.log(contact)
  client.destroy()
})

client.on('message', (message) => {
  console.log(message.body)

  if (message.body === '!ping') {
    message.reply('pong')
  }
})

client.initialize()
