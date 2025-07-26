// preload.js
import { contextBridge, ipcRenderer } from 'electron'

console.log('Preload script: STARTING execution.') // Added log

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Sends HTML content (as Uint8Array) to the main process for silent printing.
   * @param htmlContentUint8Array The HTML data as a Uint8Array.
   * @returns A Promise that resolves when the print request is sent to the main process.
   * The actual print success/failure will be communicated via 'print-status' event.
   */
  silentPrintHtml: (
    htmlContentUint8Array: Uint8Array,
  ): Promise<{ success: boolean; message?: string }> => {
    console.log('Preload script: Invoking print-content from renderer.') // Added log
    return ipcRenderer.invoke('print-content', htmlContentUint8Array)
  },

  /**
   * Listens for print status updates from the main process.
   * @param callback A function to be called with the print status ({ success: boolean, message?: string }).
   */
  onPrintStatus: (callback: (status: { success: boolean; message?: string }) => void) => {
    console.log('Preload script: Setting up onPrintStatus listener.') // Added log
    const listener = (
      event: Electron.IpcRendererEvent,
      status: { success: boolean; message?: string },
    ) => callback(status)
    ipcRenderer.on('print-status', listener)
    // Return an unsubscribe function
    return () => ipcRenderer.removeListener('print-status', listener)
  },
})

console.log('Preload script: electronAPI exposed via contextBridge!') // Added log
console.log('Preload script: FINISHED execution.') // Added log
