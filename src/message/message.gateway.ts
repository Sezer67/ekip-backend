import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from './message.entity';
@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  async sendMessageSocket(id: string, message: Message): Promise<boolean> {
    return this.server.emit(id, message);
  }
}
