const { Client } = require('whatsapp-web.js')
const { nanoid } = require('nanoid')

console.log('App is running')

let exPath = `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`

// Use the saved values
const client = new Client({
  puppeteer: { headless: false, executablePath: exPath },
})

let currentSession

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
  // sessionData = session;
  currentSession = session
})

client.on('qr', (qr) => {
  console.log('qr: ', qr)
})

client.on('ready', () => {
  console.log('Client is ready!')
  const info = client.info
  let auth = {
    type: 'auth',
    info: 'authentication-session',
    status: 'success',
    message: {
      qrcode: currentSession,
      number: info.me.user,
      name: info.pushname,
      id: nanoid(),
    },
  }
  process.send(auth)
  client.destroy()
})

// client.on("message", (message) => {
//   console.log(message.body);

//   if (message.body === "!ping") {
//     message.reply("pong");
//   }
// });

client.initialize()
