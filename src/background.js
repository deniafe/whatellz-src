'use strict'

const fs = require('fs')
// import { ipcMain, dialog } from 'electron'
import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const { fork } = require('child_process')

const child = {}

const Store = require('electron-store')
const store = new Store()

store.set('unicorn', '🦄')
console.log(store.get('unicorn'))
//=> '🦄'

// Use dot-notation to access nested properties
store.set(`foo.bar`, false)
console.log(store.get('foo'))
//=> {bar: true}

store.delete('unicorn')
console.log(store.get('unicorn'))

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
  })

  // eslint-disable-next-line no-undef
  ipcMain.on('min', () => win.minimize())
  ipcMain.on('max', () => {
    // eslint-disable-next-line no-undef
    if (win.isMaximized()) {
      // eslint-disable-next-line no-undef
      win.unmaximize()
    } else {
      // eslint-disable-next-line no-undef
      win.maximize()
    }
  })
  // eslint-disable-next-line no-undef
  ipcMain.on('close', () => {
    win.close()
  })

  // Adding different bots to the database

  ipcMain.on('set-campaigns', (event, campaigns) => {
    store.set('campaigns', campaigns)
    win.webContents.send('set-campaigns', store.get('campaigns'))
  })

  ipcMain.on('get-campaigns', () => {
    win.webContents.send('set-campaigns', store.get('campaigns'))
  })

  // Adding different bots to the database

  ipcMain.on('set-bots', (event, bots) => {
    store.set('bots', bots)
    win.webContents.send('set-bots', store.get('bots'))
  })

  ipcMain.on('get-bots', () => {
    win.webContents.send('set-bots', store.get('bots'))
  })

  // Adding different skills to the bot

  ipcMain.on('set-skills', (event, skills) => {
    store.set('skills', skills)
    win.webContents.send('set-skills', store.get('skills'))
  })

  ipcMain.on('get-skills', () => {
    win.webContents.send('set-skills', store.get('skills'))
  })

  // Adding different actions to the bot

  ipcMain.on('set-actions', (event, actions) => {
    store.set('actions', actions)
    win.webContents.send('set-actions', store.get('actions'))
  })

  ipcMain.on('get-actions', () => {
    win.webContents.send('set-actions', store.get('actions'))
  })

  // Scanning Qr codes of whatsapp accounts
  ipcMain.on('scan-qr-code', () => {
    let auth = fork(
      `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/auth.js`,
    )
    auth.on('error', (data) => {
      console.log(`An error just occurred ${data}`)
    })
    auth.on('message', (data) => {
      win.webContents.send('qr-code', data.message)
    })
  })

  ipcMain.on('set-accounts', (event, accounts) => {
    store.set('accounts', accounts)
    win.webContents.send('set-accounts', store.get('accounts'))
  })

  ipcMain.on('get-accounts', () => {
    win.webContents.send('set-accounts', store.get('accounts'))
  })

  // Database actions for collections of numbers
  ipcMain.on('set-numbers', (event, args) => {
    store.set('numbers', args)
    win.webContents.send('set-numbers', store.get('numbers'))
  })

  ipcMain.on('get-numbers', () => {
    win.webContents.send('set-numbers', store.get('numbers'))
  })

  // Database actions for whatsapp collections of group of numbers
  // ipcMain.on('set-wa-group-numbers', (event, args) => {
  //   store.set('wa-group-numbers', args)
  //   win.webContents.send('set-wa-group-numbers', store.get('wa-group-numbers'))
  // })

  // ipcMain.on('get-wa-group-numbers', () => {
  //   win.webContents.send('set-wa-group-numbers', store.get('wa-group-numbers'))
  // })

  // Adding different contacs to the database

  ipcMain.on('set-contacts', (event, contacts) => {
    store.set('contacts', contacts)
    win.webContents.send('set-contacts', store.get('contacts'))
  })

  ipcMain.on('get-contacts', () => {
    win.webContents.send('set-contacts', store.get('contacts'))
  })

  ipcMain.on('set-scheduled-numbers', (event, numbers) => {
    store.set('scheduledNumbers', numbers)
    win.webContents.send('set-scheduled-numbers', store.get('scheduledNumbers'))
  })

  ipcMain.on('get-scheduled-numbers', () => {
    win.webContents.send('set-scheduled-numbers', store.get('scheduledNumbers'))
  })

  ipcMain.on('set-successful-numbers', (event, contacts) => {
    store.set('successfulNumbers', contacts)
    win.webContents.send(
      'set-successful-numbers',
      store.get('successfulNumbers'),
    )
  })

  ipcMain.on('get-successful-numbers', () => {
    win.webContents.send(
      'set-successful-numbers',
      store.get('successfulNumbers'),
    )
  })

  // Work on scraping whatsapp numbers
  ipcMain.on('scrape-group-numbers', (event, args) => {
    let clearInt = false
    let groups = fork(
      `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/get-groups.js`,
    )
    groups.on('error', (data) => {
      console.log(`An error just occurred ${data}`)
    })
    groups.on('message', (data) => {
      if (data.type === 'clearInt') {
        console.log('The message is a clearInt message')
        clearInt = true
      }
      if (data.type === 'alert') {
        win.webContents.send('alert', data)
      }
      if (data.type === 'terminate') {
        console.log('About to campaign kill child process')
        groups.kill()
        win.webContents.send('campaign-terminated', data)
        console.log('Killed campaign child process')
      }
      if (data.type === 'wa-group-collection') {
        win.webContents.send('wa-group-collection', data)
      }
    })
    let argInterval = setInterval(() => {
      groups.send(args)
    }, 1000)

    let cleanInterval = setInterval(() => {
      if (clearInt) {
        clearInterval(argInterval)
      }
    }, 3000)

    setTimeout(() => {
      clearInterval(cleanInterval)
    }, 10000)
  })

  // Work on scraping whatsapp numbers
  ipcMain.on('scrape-contacts-numbers', (event, args) => {
    let clearInt = false
    let contacts = fork(
      `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/get-contacts.js`,
    )
    contacts.on('error', (data) => {
      console.log(`An error just occurred ${data}`)
    })
    contacts.on('message', (data) => {
      if (data.type === 'clearInt') {
        console.log('The message is a clearInt message')
        clearInt = true
      }
      if (data.type === 'alert') {
        win.webContents.send('alert', data)
      }
      if (data.type === 'terminate') {
        console.log('About to campaign kill child process')
        contacts.kill()
        win.webContents.send('campaign-terminated')
        console.log('Killed campaign child process')
      }
      if (data.type === 'wa-contacts-collection') {
        win.webContents.send('wa-contacts-collection', data)
      }
    })
    let argInterval = setInterval(() => {
      contacts.send(args)
    }, 1000)

    let cleanInterval = setInterval(() => {
      if (clearInt) {
        clearInterval(argInterval)
      }
    }, 3000)

    setTimeout(() => {
      clearInterval(cleanInterval)
    }, 10000)
  })

  // Work on verifying whatsapp numbers
  ipcMain.on('verify-numbers', (event, args) => {
    let clearInt = false
    let verify = fork(
      `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/verify.js`,
    )
    verify.on('error', (data) => {
      console.log(`An error just occurred ${data}`)
    })
    verify.on('message', (data) => {
      if (data.type === 'clearInt') {
        console.log('The message is a clearInt message')
        clearInt = true
      }
      if (data.type === 'alert') {
        win.webContents.send('alert', data)
      }
      if (data.type === 'terminate') {
        console.log('About to campaign kill child process')
        verify.kill()
        win.webContents.send('campaign-terminated')
        console.log('Killed campaign child process')
      }
      if (data.type === 'verify') {
        win.webContents.send('display-verified-numbers', data)
      }
    })
    let argInterval = setInterval(() => {
      verify.send(args)
    }, 1000)

    let cleanInterval = setInterval(() => {
      if (clearInt) {
        clearInterval(argInterval)
      }
    }, 3000)

    setTimeout(() => {
      clearInterval(cleanInterval)
    }, 10000)
  })

  ipcMain.on('launch-campaign', (events, arg) => {
    let concatNumbers = [...arg.settings.numbers.map((log) => log.numbers)]
    concatNumbers = [].concat.apply([], concatNumbers)

    let schdNumbers = concatNumbers.map((number) => {
      number.userId = arg.userId
      number.campaignId = arg.id
      return number
    })

    // Get the stored scheduled videos from the store
    let storedNumbers = store.get('scheduledNumbers')
    if (!storedNumbers) storedNumbers = []
    // Delete every video that has the argument id as a campaign id
    const filteredNumbers = storedNumbers.filter(
      (number) => number.campaignId !== arg.id,
    )
    // Combine the remaining from the stored group and new sheduled group
    const toBeStoredNumbers = [...schdNumbers, ...filteredNumbers]
    // Set the combination as scheduled videos
    store.set('scheduledNumbers', toBeStoredNumbers)
    // Get the stored successful fromthe store
    let storedSuccessful = store.get('successfulNumbers')
    if (!storedSuccessful) storedSuccessful = []
    // Delete every video that has the argument id as a campaign id
    const filteredSuccessful = storedSuccessful.filter(
      (number) => number.campaignId !== arg.id,
    )
    store.set('successfulNumbers', filteredSuccessful)
    win.webContents.send('set-scheduled-numbers', store.get('scheduledNumbers'))
    win.webContents.send(
      'set-successful-numbers',
      store.get('successfulNumbers'),
    )

    // Path where the session data will be stored
    const bots = store.get('bots')
    const bot = bots.filter((bot) => bot.title === arg.settings.bot)[0]
    const allSkills = store.get('skills')
    const skills = allSkills.filter((skill) => skill.botId === bot.id)
    const actions = store.get('actions')
    // TODO: YOU STILL NEED TO COME BACK AND PROPERLY SEGMENT THE ACTIONS
    const args = { bot, campaign: arg, skills, actions }
    const SESSION_FILE_PATH = `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/test.js`
    const SESSION_FILE2_PATH = `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/${arg.title}.js`

    const runBot = () => {
      let clearInt = false
      child[arg.title] = fork(
        `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/${arg.title}.js`,
      )
      child[arg.title].on('error', (data) => {
        console.log(`An error just occurred ${data}`)
      })
      child[arg.title].on('message', (data) => {
        if (data.type === 'clearInt') {
          console.log('The message is a clearInt message')
          clearInt = true
        }

        if (data.type === 'launch') {
          win.webContents.send('campaign-launched', data)
        }

        if (data.type === 'alert') {
          win.webContents.send('alert', data)
        }
        if (data.type === 'messageAlert' && data.status === 'success') {
          let successfulNum = store
            .get('scheduledNumbers')
            .filter((num) => num.number === data.number.replace('@c.us', ''))[0]
          win.webContents.send('successful-numbers', successfulNum)
        }

        if (data.type === 'interval') {
          win.webContents.send('interval', data)
        }

        if (data.type === 'campaign') {
          console.log('The message is a campaign message', data)
        }

        if (data.type === 'contact') {
          win.webContents.send('contact', data)
        }

        if (data.type === 'terminate') {
          console.log('About to campaign kill child process')
          child[arg.title].kill()
          win.webContents.send('campaign-terminated', data)
          console.log('Killed campaign child process')
        }
      })
      let argInterval = setInterval(() => {
        child[arg.title].send(args)
      }, 1000)

      let cleanInterval = setInterval(() => {
        if (clearInt) {
          clearInterval(argInterval)
        }
      }, 3000)

      setTimeout(() => {
        clearInterval(cleanInterval)
      }, 10000)
    }

    fs.readFile(SESSION_FILE2_PATH, 'utf8', (err, data) => {
      if (err) {
        return fs.readFile(SESSION_FILE_PATH, 'utf8', (err, data) => {
          if (err) {
            return console.log(err)
          }

          fs.writeFile(SESSION_FILE2_PATH, data, (err) => {
            if (err) {
              return console.log(err)
            }
            console.log('Done!')
            runBot()
          })
        })
      }
      if (data) {
        runBot()
      }
    })

    // if (fs.existsSync(SESSION_FILE_PATH)) {
    //   const code = require(SESSION_FILE_PATH)
    //   fs.writeFile(SESSION_FILE2_PATH, code, function (err) {
    //     if (err) {
    //       console.error(err)
    //       console.log(err)
    //     }
    //   })
    // }
  })

  ipcMain.on('stop-campaign', (events, arg) => {
    // const bots = store.get('bots')
    // const bot = bots.filter((bot) => bot.number === arg.settings.bot)[0]
    let data = {
      type: 'terminate',
      campaignId: arg.id,
      userId: arg.userId,
      // botId: bot.id,
      // botNumber: bot.number,
      info: 'error',
      status: 'error',
      title: `Campaign ${arg.title} : has been disconnected`,
      message: `You have terminated this campaign`,
    }
    console.log('About to campaign kill child process')
    child[arg.title].kill()
    win.webContents.send('campaign-terminated', data)
    console.log('Killed campaign child process')
  })

  ipcMain.on('launch-bot', () => {
    let clearInt = false
    const bots = store.get('bots')
    const allSkills = store.get('skills')
    const campaigns = store.get('campaigns')
    const args = { bots, allSkills, campaigns }
    let bot = fork(
      `C:/Users/DEBBY/projects/Socio Toolz Projects/whatellz/src/server/app.js`,
    )

    bot.on('message', (data) => {
      if (data.type === 'clearInt') {
        console.log('The message is a clearInt message')
        clearInt = true
      }
      if (data.type === 'verify') {
        win.webContents.send('display-verified-numbers', data)
      }
    })

    bot.on('error', (data) => {
      console.log(`An error just occurred ${data}`)
    })

    let argInterval = setInterval(() => {
      bot.send(args)
    }, 1000)

    let cleanInterval = setInterval(() => {
      if (clearInt) {
        clearInterval(argInterval)
      }
    }, 3000)

    setTimeout(() => {
      clearInterval(cleanInterval)
    }, 10000)
  })

  ipcMain.on('export-contacts', (events, arg) => {
    const fileName = dialog.showSaveDialogSync({
      title: 'Save Contacts',
      filters: [
        { name: 'txt', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })
    if (typeof fileName === 'undefined') {
      return
    }
    const contacts = arg.contacts
    fs.writeFileSync(fileName, contacts, 'utf-8')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
