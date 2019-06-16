import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { AuthService, AmendService } from 'src/services'
import { Inject } from '@nestjs/common'
import { withTryCatch, withAuthentication, withResponse } from 'src/decorators'
import { IMessage } from 'src/../../interfaces'

@WebSocketGateway()
export class AmendGateway {
  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService,
    @Inject('AmendService')
    private readonly amendService: AmendService
  ) {}

  @WebSocketServer()
  io: Server

  @SubscribeMessage('amend')
  @withTryCatch
  async handleAmend(client: Socket, message: IMessage<{ id: string }>) {
    const response = await this.amendService.getAmend(message.data.id)
    client.emit('amend/' + message.data.id, response)
  }

  @SubscribeMessage('postAmend')
  @withResponse('postAmend')
  @withTryCatch
  @withAuthentication
  handlePostAmend(
    client: Socket,
    message: IMessage<{
      name: string
      description: string
      patch: string
      version: number
      textID: string
    }>
  ) {
    return this.amendService.postAmend(message.data, this.io)
  }

  @SubscribeMessage('upVoteAmend')
  @withResponse('upVoteAmend')
  @withTryCatch
  @withAuthentication
  async handleUpVoteAmend(client: Socket, message: IMessage<{ id: string }>) {
    return this.amendService.upVoteAmend(message.data, this.io)
  }

  @SubscribeMessage('downVoteAmend')
  @withResponse('downVoteAmend')
  @withTryCatch
  @withAuthentication
  async handleDownVoteAmend(client: Socket, message: IMessage<{ id: string }>) {
    return this.amendService.downVoteAmend(message.data, this.io)
  }

  @SubscribeMessage('unVoteAmend')
  @withResponse('unVoteAmend')
  @withTryCatch
  @withAuthentication
  async handleUnVoteAmend(client: Socket, message: IMessage<{ id: string }>) {
    return this.amendService.unVoteAmend(message.data, this.io)
  }

  @SubscribeMessage('postArgument')
  @withResponse('postArgument')
  @withTryCatch
  @withAuthentication
  async handlePostArgument(
    client: Socket,
    message: IMessage<{ amendID: string; text: string; type: string }>
  ) {
    return this.amendService.postArgument(message.data, this.io)
  }

  @SubscribeMessage('upVoteArgument')
  @withResponse('upVoteArgument')
  @withTryCatch
  @withAuthentication
  async handleUpVoteArgument(
    client: Socket,
    message: IMessage<{ amendID: string; argumentID: string }>
  ) {
    return this.amendService.upVoteArgument(message.data, this.io)
  }

  @SubscribeMessage('downVoteArgument')
  @withResponse('downVoteArgument')
  @withTryCatch
  @withAuthentication
  async handleDownVoteArgument(
    client: Socket,
    message: IMessage<{ amendID: string; argumentID: string }>
  ) {
    return this.amendService.downVoteArgument(message.data, this.io)
  }

  @SubscribeMessage('unVoteArgument')
  @withResponse('unVoteArgument')
  @withTryCatch
  @withAuthentication
  async handleUnVoteArgument(
    client: Socket,
    message: IMessage<{ amendID: string; argumentID: string }>
  ) {
    return this.amendService.unVoteArgument(message.data, this.io)
  }
}
