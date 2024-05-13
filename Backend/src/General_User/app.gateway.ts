import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Payload } from './types';
import { UserService } from './guser.service'; 

@WebSocketGateway()
export class AppGateway {

  constructor(
    private readonly userService: UserService
  ) {}

  @WebSocketServer() server: Server; // Decorator to inject WebSocket server instance

  async handleConnection(client: Socket) {
    // Handle client connection
  }

  async handleDisconnect(client: Socket) {
    // Handle client disconnection
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Payload): Promise<void> {
    try {
      const user = await this.userService.findOneByName(payload.name);
      if (user) {
        this.server.emit('recMessage', { user, message: payload.message });
      } else {
        // Handle user not found
      }
    } catch (error) {
      // Handle error
    }
  }

  // Other methods...
}
