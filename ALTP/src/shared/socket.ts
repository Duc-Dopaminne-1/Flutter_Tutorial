import socketIO from 'socket.io-client'
import { userInfo } from '@/shared/UserInfo'
import { SOCKET_URL } from '@/shared/init'

let socket = null
let callback = null

export const startSocketIO = (cb?: any) => {
  socket = socketIO(SOCKET_URL, {
    transports: ['websocket'],
    jsonp: false
  })

  socket.connect()

  socket.on('connect', () => {
    socket.emit('email', {
      email: userInfo.getUserInfo().email
    })

    socket.on('createRoom', data => {
      cb(data)
    })

    socket.on('startExaming', data => {
      callback(data.indexQuestion)
    })

    socket.on('disconnect', () => {
      console.log('****** connection to server lost.')
    })
  })
}

export const closeSocketIO = () => {
  socket.close()
  socket = null
}

export const readySolo = (roomId: string, indexQuestion: number, cb: any) => {
  callback = cb
  socket &&
    socket.emit('examing', {
      roomId,
      indexQuestion
    })
}

export const nextQuestion = (
  roomId: string,
  indexQuestion: number,
  cb: any
) => {
  callback = cb
  socket &&
    socket.emit('examing', {
      roomId,
      indexQuestion
    })
}

export const loseExaming = (roomId: string, typeNumber: number) => {
  socket &&
    socket.emit('examing', {
      roomId,
      indexQuestion: typeNumber
    })
}

export const doneExaming = (roomId: string) => {
  socket &&
    socket.emit('doneExaming', {
      roomId
    })
}
