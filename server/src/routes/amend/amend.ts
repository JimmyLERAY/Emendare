import socketIO from 'socket.io'
import { Amend } from '../../models'

export const amend = {
  name: 'amend',
  callback: ({ socket }: { socket: socketIO.Socket }) => async ({
    data
  }: any) => {
    socket.emit('amend/' + data.id, await Amend.getAmend(data.id))
  }
}
