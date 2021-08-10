const _ = require('lodash')
const qrcode = require('qrcode-terminal')
// const fs = require('fs')
const { Client } = require('whatsapp-web.js')

// Path where the session data will be stored
// const SESSION_FILE_PATH = `C:/Users/DEBBY/projects/Socio Toolz Projects/whattelz/src/server/session.json`
console.log('App is running')

// Load the session data if it has been previously saved
let sessionData
// if (fs.existsSync(SESSION_FILE_PATH)) {
//   sessionData = require(SESSION_FILE_PATH)
//   console.log('session data before profile: ', sessionData)
// }

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000))

let count = 0
process.on('message', (arg) => {
  const clearInt = {
    type: 'clearInt',
    title: 'Clear Interval',
  }
  process.send(clearInt)

  if (!count) {
    count++
    // console.log('Count in if statement :', count)

    const campaigns = arg.campaigns.filter(
      (campaign) => campaign.status === 'Active',
    )
    const bots = arg.bots
    const allSkills = arg.allSkills

    let campaign
    let bot
    let skills
    let client = []

    const wabot = ({ campaign, bot, i }) => {
      sessionData = campaign.settings.account.qrcode
      // console.log('session data after profile: ', sessionData)

      client[i] = new Client({
        puppeteer: { headless: false },
        session: sessionData,
      })

      client[i].on('qr', (qr) => {
        qrcode.generate(qr, { small: true })
        console.log('qr: ', qr)
      })

      client[i].on('ready', async () => {
        console.log(`Client ${i + 1} is ready`)
        // const message = campaign.settings.messages[0].content
        let numbers
        for (let c = 0; c < campaign.settings.numbers.length; c++) {
          numbers = campaign.settings.numbers[c].numbers
          let maxInt = campaign.settings.delay.max
          let minInt = campaign.settings.delay.min
          let message
          let number
          let interval
          let random
          for (let j = 0; j < numbers.length; j++) {
            interval = _.random(maxInt, minInt)
            random = _.random(0, campaign.settings.messages.length)
            message = campaign.settings.messages[random].content
            number = `${numbers[j].body}@c.us`
            client[i].sendMessage(number, message)
            console.log(`I am going to sleep for ${interval} seconds`)
            await sleep(interval)
          }
        }
      })

      client[i].on('message', async (message) => {
        // let contact = await message.getContact()
        let currentNum = message.to.replace('@c.us', '')
        skills = allSkills.filter((skill) => skill.botNum === currentNum)
        console.log('Current bot', bot.id)
        console.log(`Client ${i} : ${client[i]}`)

        // console.log('The person that sent the message', message.from)
        console.log('Client receiving the message', client[i].info.me.user)

        let skill
        for (let j = 0; j < skills.length; j++) {
          skill = skills[j]
          console.log(skill.title)
          if (message.body === skill.title) {
            let action
            for (let x = 0; x < skill.actions.length; x++) {
              action = skill.actions[x]
              message.reply(action.body.text)
              console.log(message.body)
            }
          }
        }
      })

      client[i].initialize()
    }

    for (let i = 0; i < campaigns.length; i++) {
      campaign = campaigns[i]
      bot = bots.filter((bot) => bot.number === campaign.settings.bot)[0]

      wabot({ campaign, bot, i })
    }
  }
  console.log('Count outside if statement :', count)
})
