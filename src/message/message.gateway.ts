import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from './message.entity';
@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  async sendMessageSocket(message: Message): Promise<boolean> {
    return this.server.emit('socket-message', message);
  }
}
