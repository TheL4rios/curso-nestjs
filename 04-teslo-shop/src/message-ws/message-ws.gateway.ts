import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessageWsService } from './message-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
    client.emit('get-old-messages', this.messageWsService.getMessages());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  // message-form-client
  @SubscribeMessage('message-form-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // Emite solo al cliente
    // client.emit('message-from-server', {
    //   fullName: 'hola',
    //   message: 'hola'
    // });

    // Emitir a todos menos, al cliente inicial.
    // client.broadcast.emit('message-from-server', {
    //     fullName: 'hola',
    //     message: 'hola'
    // });

    const message = {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'No message!!'
    };
    this.messageWsService.addMessage(message);
    this.wss.emit('message-from-server', message);
  }
}
