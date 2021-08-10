const { Client } = require('whatsapp-web.js')

// Wait to receive message from the front end
let count = 0
process.on('message', (arg) => {
  const clearInt = {
    type: 'clearInt',
    title: 'Clear Interval',
  }
  process.send(clearInt)

  console.log('Count is now :', count)

  const numbers = arg.numbers
  const account = arg.account
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
      let authAlert = {
        type: 'alert',
        info: 'success',
        status: 'success',
        title: `Bot Auth Successful`,
        message: `Bot has been authenticated successfully`,
      }
      process.send(authAlert)
    })

    client.on('qr', (qr) => {
      console.log('qr: ', qr)
    })

    client.on('ready', async () => {
      console.log('Client is ready!')
      // const isVerified = await client.isRegisteredUser('+2348031863874@c.us')
      let isVerified

      let number
      let verified = []
      let failedVerified = []
      let isRegisteredNumbers = []
      let isRegistered
      let verifiedAlert
      for (let i = 0; i < numbers.length - 1; i++) {
        number = numbers[i].number
        isVerified = await client.isRegisteredUser(`+${number}@c.us`)
        isRegistered = await client.getNumberId(number)
        if (isRegistered) {
          isRegisteredNumbers.push(isRegistered)
        }
        verifiedAlert = Object.assign({}, numbers[i])
        verifiedAlert.verified = isVerified
        verifiedAlert.type = 'verify'
        process.send(verifiedAlert)
        if (isVerified) verified.push(number)
        if (!isVerified) failedVerified.push(number)
      }
      console.log('Verrified numbers are :', verified.length)
      console.log('Unverified numbers are :', failedVerified.length)
      console.log('Registered numbers are:', isRegisteredNumbers.length)

      // console.log(`2348031863874 :`, isVerified)

      client.destroy()
    })

    client.initialize()
  }
  console.log('Count outside if statement :', count)
})
