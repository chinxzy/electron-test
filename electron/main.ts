import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log' // Import electron-log for autoUpdater logging

// This handles Squirrel.Windows startup events, crucial for installers
if (require('electron-squirrel-startup')) {
  app.quit() // or process.exit(0);
}

// 👉 FIX: Configure electron-log transports BEFORE assigning to autoUpdater.logger
log.transports.file.level = 'info' // Set file log level
log.transports.console.level = 'info' // Set console log level (optional)
log.info('App starting...') // Log app start using electron-log

// Electron Forge's Vite plugin injects these global variables.
// You need to declare them so TypeScript knows they exist.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string
declare const MAIN_WINDOW_PRELOAD_VITE_URL: string | undefined

let mainWin: BrowserWindow | null

// Assign electron-log to autoUpdater's logger
autoUpdater.logger = log

function createWindow(): void {
  console.log('Main process: createWindow called.') // Log 1

  let preloadPath: string
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // In development, if the URL is injected, use it.
    // This is how Forge typically handles it in dev.
    preloadPath = path.join(
      app.getAppPath(),
      '.vite',
      'preload',

      'preload.js',
    )
    console.log(`Main process: (Dev) Using preload path: ${preloadPath}`)
  } else {
    // 👉 CRITICAL FIX FOR PRODUCTION PRELOAD PATH:
    // When packaged, __dirname points to app.asar/.vite/main/
    // Preload.cjs is at app.asar/.vite/renderer/${MAIN_WINDOW_VITE_NAME}/preload.cjs
    // We need to construct the path relative to the app's root (app.asar)
    preloadPath = path.join(
      app.getAppPath(),
      '.vite',
      'preload',

      'preload.js',
    )
    console.log(`Main process: (Prod) Using preload path: ${preloadPath}`)
  }

  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadPath,
      devTools: true,
    },
    autoHideMenuBar: true,
  })
  // mainWin.setMenu(null)
  mainWin.maximize()
  console.log('Main process: BrowserWindow created.') // Log 2

  mainWin.webContents.openDevTools() // Explicitly open DevTools

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log('Main process: Loading dev server URL.') // Log 3a
    mainWin
      .loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
      .then(() => console.log('✅ Loaded dev server.'))
      .catch((err) => console.error('❌ Failed to load dev server:', err))
  } else {
    const htmlPath = path.join(
      app.getAppPath(),
      '.vite',
      'renderer',
      MAIN_WINDOW_VITE_NAME,
      'index.html',
    )
    console.log(`Main process: Loading production HTML from: ${htmlPath}`) // Log 3b
    mainWin
      .loadFile(htmlPath)
      .then(() => console.log('✅ Loaded index.html (production build).'))
      .catch((err) => console.error('❌ Failed to load index.html:', err))
  }

  mainWin.on('closed', () => {
    console.log('Main process: Main window closed.') // Log 4
    mainWin = null
  })
}

app.whenReady().then(() => {
  console.log('Main process: app.whenReady fired.') // Log 5
  createWindow()

  // 👉 AUTO-UPDATER LOGIC
  if (app.isPackaged) {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'chinxzy',
      repo: 'electron-test',
      private: true,
    })
    log.info('Checking for updates in packaged app...')
    autoUpdater.checkForUpdatesAndNotify()
  } else {
    log.info('App is in development mode, skipping auto-update check.')
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info)
    dialog
      .showMessageBox(mainWin!, {
        type: 'info',
        title: 'Update Available',
        message: `A new version ${info.version} is available. Do you want to download it now?`,
        buttons: ['Yes', 'No'],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info)
  })

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err)
    dialog.showErrorBox('Update Error', `Error checking for updates: ${err.message}`)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    log.info(log_message)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info)
    dialog
      .showMessageBox(mainWin!, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. It will be installed on exit.',
        buttons: ['Install now', 'Later'],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  })
  // 👉 END AUTO-UPDATER LOGIC

  ipcMain.handle('print-content', async (event, htmlContentUint8Array: Uint8Array) => {
    console.log('📥 Received print request')

    let printWin: BrowserWindow | null = null
    let tempHtmlFilePath: string | undefined

    try {
      console.log('🧠 Decoding HTML content...')
      const htmlContent = new TextDecoder().decode(htmlContentUint8Array)
      console.log('✅ HTML content decoded. Content length:', htmlContent.length)

      printWin = new BrowserWindow({
        show: false,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          devTools: true,
        },
      })

      printWin.webContents.openDevTools()

      printWin.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL) => {
        console.error(
          `❌ Print Window: Failed to load content: ${errorDescription} (Code: ${errorCode}) for URL: ${validatedURL}`,
        )
        printWin?.close()
        mainWin?.webContents.send('print-status', {
          success: false,
          message: `Print Load failure: ${errorDescription}`,
        })
      })

      printWin.webContents.on('did-finish-load', () => {
        console.log('📄 Print Window: Content finished loading. Starting silent print...')

        printWin?.webContents.print(
          {
            silent: true,
            printBackground: true,
            margins: { marginType: 'none' },
          },
          (success, failureReason) => {
            console.log('🖨️ Print callback returned.')
            if (success) {
              console.log('✅ Printed successfully.')
              event.sender.send('print-status', { success: true })
            } else {
              console.error('❌ Print failed:', failureReason)
              event.sender.send('print-status', {
                success: false,
                message: failureReason,
              })
            }
            printWin?.close()
          },
        )
      })

      tempHtmlFilePath = path.join(os.tmpdir(), `print_content_${Date.now()}.html`)
      await fs.writeFile(tempHtmlFilePath, htmlContent, { encoding: 'utf-8' })
      console.log(`🌐 Loading content from temporary file: ${tempHtmlFilePath}`)
      await printWin.loadURL(`file://${tempHtmlFilePath}`)
      console.log('✅ Print window loaded (from file).')

      return { success: true }
    } catch (err: any) {
      console.error('❌ Error during print:', err)
      printWin?.close()
      mainWin?.webContents.send('print-status', {
        success: false,
        message: err.message,
      })
      return { success: false, message: err.message }
    } finally {
      if (tempHtmlFilePath) {
        fs.unlink(tempHtmlFilePath).catch((err) =>
          console.error('Failed to delete temp HTML file:', err),
        )
      }
    }
  })
})

app.on('window-all-closed', () => {
  console.log('Main process: All windows closed.') // Log 6
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  console.log('Main process: App activated.') // Log 7
  if (mainWin === null) {
    createWindow()
  }
})
