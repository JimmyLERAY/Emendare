import socketIO from 'socket.io'
import config from '../../config'

// Fetch API polyfills
import fetch from 'node-fetch'

export const contributors = {
  name: 'contributors',
  callback: ({ socket }: { socket: socketIO.Socket }) => async () => {
    try {
      const res = await fetch(config.contributions)
      const data: any = await res.json()
      socket.emit('contributors', { data })
    } catch (error) {
      console.error(error)
      socket.emit('contributors', { error })
    }
  }
}
