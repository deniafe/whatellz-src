const qrcode = require('qrcode-terminal')
const fs = require('fs')
const { Client } = require('whatsapp-web.js')

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json'
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

console.log(client)

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

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
  console.log('qr: ', qr)
})

client.on('ready', () => {
  console.log('Client is ready!')
  client.sendMessage('2348072029488@c.us', 'Test to Ore num')
  client.sendMessage('2348035725391@c.us', 'Test to Daddy num')
})

client.on('message', (message) => {
  console.log(message.body)

  if (message.body === '!ping') {
    message.reply('pong')
  }
})

client.initialize()
