const _ = require('lodash')
// const fs = require('fs')
const { Client } = require('whatsapp-web.js')
const { MessageMedia } = require('whatsapp-web.js')

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
    // console.log('Count in if statement :', count

    let campaign = arg.campaign
    let bot = arg.bot
    let skills = arg.skills
    let allActions = arg.actions
    let showBrowser = campaign.settings.showBrowser

    // const wabot = ({ campaign, bot, i }) => {
    sessionData = campaign.settings.account.qrcode

    const client = new Client({
      puppeteer: { headless: !showBrowser },
      session: sessionData,
    })

    let launched = {
      type: 'launch',
      info: 'info',
      status: 'success',
    }
    process.send(launched)

    client.on('disconnected', (reason) => {
      let authAlert = {
        type: 'alert',
        campaignId: campaign.id,
        botId: bot.id,
        botNumber: bot.number,
        info: 'error',
        status: 'error',
        title: `Bot ${bot.title} : has been disconnected`,
        message: `There was an error connecting Bot ${bot.title} - ${reason}`,
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
        campaignId: campaign.id,
        botId: bot.id,
        botNumber: bot.number,
        info: 'error',
        status: 'error',
        title: `Bot ${bot.title} : Auth Failed`,
        message: `There was an error authenticating Bot ${bot.title} - ${message}`,
      }
      process.send(authAlert)
      let terminateAlert = {
        type: 'terminate',
      }
      process.send(terminateAlert)
    })

    client.on('authenticated', () => {
      let authAlert = {
        type: 'alert',
        campaignId: campaign.id,
        botId: bot.id,
        botNumber: bot.number,
        info: 'success',
        status: 'success',
        title: `Bot ${bot.title} : Auth Successful`,
        message: `Bot ${bot.title} has been authenticated successfully`,
      }
      process.send(authAlert)
    })

    client.on('ready', async () => {
      // TODO: SEND A MESSAGE TO THE FRONT END THAT BROWSER IS READY
      let clientAlert = {
        type: 'alert',
        campaignId: campaign.id,
        botId: bot.id,
        botNumber: bot.number,
        info: 'info',
        status: 'info',
        title: `Bot ${bot.title} is Ready`,
        message: `Bot ${bot.title} has been successfully initialised`,
      }
      process.send(clientAlert)
      // const message = campaign.settings.messages[0].content
      if (campaign.settings.messages.length) {
        let numbers
        for (let c = 0; c < campaign.settings.numbers.length; c++) {
          numbers = campaign.settings.numbers[c].numbers
          let maxInt = campaign.settings.delay.max
          let minInt = campaign.settings.delay.min
          let msgObj
          let media
          let message
          let number
          let interval
          let random
          for (let j = 0; j < numbers.length; j++) {
            interval = _.random(maxInt, minInt)
            random = _.random(0, campaign.settings.messages.length - 1)
            msgObj = campaign.settings.messages[random]
            message = msgObj.content
            if (msgObj.image) {
              media = MessageMedia.fromFilePath(msgObj.image.path)
            }
            number = `${numbers[j].number || numbers[j]}@c.us`
            try {
              client.sendMessage(number, message)
              client.sendMessage(number, media)
              let messageAlert = {
                type: 'alert',
                campaignId: campaign.id,
                botId: bot.id,
                botNumber: bot.number,
                info: 'success',
                status: 'success',
                title: 'Message Sent Successfully',
                message: `Message has been successfully sent to ${number}`,
              }
              process.send(messageAlert)

              const delayAlert = {
                type: 'interval',
                title: 'Interval',
                message: `Waiting for ${interval} seconds`,
                interval,
              }
              process.send(delayAlert)

              // TODO: SEND A MESSAGE THAT A MESSAGE HAS BEEN POSTED AND IT WILL SLEEP
              // TODO: SEND A MESSAGE OF HOW LONG IT WILL SLEEP
              await sleep(interval)
            } catch (error) {
              let messageAlert = {
                type: 'alert',
                campaignId: campaign.id,
                botId: bot.id,
                botNumber: bot.number,
                info: 'error',
                status: 'error',
                title: 'Error Sending Message',
                message: `There was an error sending message to ${number} : ${error}`,
              }
              process.send(messageAlert)
            }
          }
        }
      }
    })

    client.on('message', async (message) => {
      // TODO: SEND A MESSAGE TO THE FRONT EVERY TIME A NEW MESSAGE COMES IN. INCLUDE ALL NECCESSARY DATA
      const contact = await message.getContact()

      const isStatus = message.isStatus
      let chat
      let isGroup = false

      if (isStatus === false) {
        chat = await message.getChat()
        isGroup = chat.isGroup
      }

      // console.log(message)

      const isSend = ({ isStatus, isGroup }) => {
        let status = true
        if (isStatus || isGroup) status = false
        return status
      }

      if (isSend({ isStatus, isGroup })) {
        let name = contact.pushname
        if (contact.isMyContact) name = contact.name
        if (contact.isBusiness) name = contact.verifiedName

        const userObj = {
          type: 'contact',
          campaignId: campaign.id,
          botId: bot.id,
          botNumber: bot.number,
          info: 'info',
          status: 'info',
          name,
          number: contact.number,
          isUser: contact.isUser,
          isGroup: contact.isGroup,
          isWAContact: contact.isWAContact,
          isMyContact: contact.isMyContact,
          isBlocked: contact.isBlocked,
          isBusiness: contact.isBusiness,
          isEnterprise: contact.isEnterprise,
        }

        process.send(userObj)

        // console.log('The person that sent the message', message.from)

        let skill
        let msg
        for (let j = 0; j < skills.length; j++) {
          skill = skills[j]
          console.log('This is the message: ', message.body)
          console.log('This is the corresponding skill: ', skill.title)
          if (message.body === skill.title) {
            const actions = allActions.filter((act) => act.skillId === skill.id)
            let action
            let media
            for (let x = 0; x < actions.length; x++) {
              msg = actions[x]
              action = actions[x]
              if (action.title === 'Text Messages') {
                if (action.body.image) {
                  media = MessageMedia.fromFilePath(action.body.image.path)
                  message.reply(media)
                }
                message.reply(action.body.text)
              } else if (
                action.title === 'Images' ||
                action.title === 'Documents'
              ) {
                media = MessageMedia.fromFilePath(action.body.path)
                message.reply(media)
              }
            }
            return
          }
        }

        if (!msg) {
          const defaultSkill = skills.filter(
            (skill) => skill.title.toLowerCase() === 'default',
          )[0]
          const defaultActions = allActions.filter(
            (act) => act.skillId === defaultSkill.id,
          )
          let action
          let media
          for (let x = 0; x < defaultActions.length; x++) {
            action = defaultActions[x]
            if (action.body.image) {
              media = MessageMedia.fromFilePath(action.body.image.path)
              message.reply(media)
            }
            message.reply(action.body.text)
            // console.log(message.body, action)
          }
        }
      }
    })

    client.initialize()
    // }

    // for (let i = 0; i < campaigns.length; i++) {
    //   campaign = campaigns[i]
    //   bot = bots.filter((bot) => bot.number === campaign.settings.bot)[0]

    //   wabot({ campaign, bot, i })
    // }
  }
})
