import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RewardsGateway {
  @WebSocketServer()
  server: Server;

  emitRewardPointsUpdate(userId: string, totalPoints: number) {
    this.server.emit('rewardPointsUpdated', { userId, totalPoints });
  }
} 