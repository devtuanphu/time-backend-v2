import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  afterInit() {
    this.logger.log('✅ WebSocket Gateway initialized on namespace /chat');
    this.logger.log(`🔌 Socket.io server is ready and listening for connections`);
  }

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.auth.userId;
      
      if (!userId) {
        this.logger.warn('Client connected without userId');
        client.disconnect();
        return;
      }

      this.logger.log(`User ${userId} connected with socket ${client.id}`);

      // Track user's socket connections
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.add(client.id);
      }

      // Join user's groups
      const groups = await this.chatGroupsService.getUserGroups(userId);
      groups.forEach((group) => {
        client.join(`group:${group.id}`);
        this.logger.log(`User ${userId} joined group:${group.id}`);
      });

      // Broadcast online status
      this.server.emit('user:online', { userId });
    } catch (error) {
      this.logger.error('Error in handleConnection:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.auth.userId;
      
      if (userId && this.userSockets.has(userId)) {
        const userSocketSet = this.userSockets.get(userId);
        if (userSocketSet) {
          userSocketSet.delete(client.id);

          // If user has no more connections, mark offline
          if (userSocketSet.size === 0) {
            this.userSockets.delete(userId);
            this.server.emit('user:offline', { userId });
            this.logger.log(`User ${userId} went offline`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error in handleDisconnect:', error);
    }
  }

  // Send message
  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string; content: string; messageType?: string },
  ) {
    try {
      const userId = client.handshake.auth.userId;
      
      if (!userId) {
        return { error: 'Unauthorized' };
      }

      const message = await this.chatGroupsService.sendMessage(
        {
          groupId: data.groupId,
          content: data.content,
          messageType: data.messageType || 'text',
        },
        userId,
      );

      // Broadcast to group
      this.server.to(`group:${data.groupId}`).emit('message:new', message);

      this.logger.log(`Message sent to group ${data.groupId} by user ${userId}`);

      return { success: true, message };
    } catch (error) {
      this.logger.error('Error in handleSendMessage:', error);
      return { error: error.message };
    }
  }

  // Typing indicator
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    const userId = client.handshake.auth.userId;
    if (!userId) return;

    client.to(`group:${data.groupId}`).emit('typing:user', {
      userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string },
  ) {
    const userId = client.handshake.auth.userId;
    if (!userId) return;

    client.to(`group:${data.groupId}`).emit('typing:user', {
      userId,
      isTyping: false,
    });
  }

  // Mark as read
  @SubscribeMessage('message:read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string; messageId: string },
  ) {
    try {
      const userId = client.handshake.auth.userId;
      
      if (!userId) {
        return { error: 'Unauthorized' };
      }

      await this.chatGroupsService.markMessageAsRead(data.messageId, userId);

      // Broadcast read receipt
      this.server.to(`group:${data.groupId}`).emit('message:read', {
        messageId: data.messageId,
        userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Error in handleMarkAsRead:', error);
      return { error: error.message };
    }
  }

  // Join group (when user added to group)
  joinGroup(userId: string, groupId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.join(`group:${groupId}`);
          this.logger.log(`User ${userId} joined group:${groupId}`);
        }
      });
    }
  }

  // Leave group
  leaveGroup(userId: string, groupId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(`group:${groupId}`);
          this.logger.log(`User ${userId} left group:${groupId}`);
        }
      });
    }
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    const userSocketSet = this.userSockets.get(userId);
    return this.userSockets.has(userId) && !!userSocketSet && userSocketSet.size > 0;
  }

  // Get online users in group
  getOnlineUsersInGroup(groupId: string): string[] {
    const room = this.server.sockets.adapter.rooms.get(`group:${groupId}`);
    if (!room) return [];

    const onlineUsers: string[] = [];
    room.forEach((socketId) => {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        const userId = socket.handshake.auth.userId;
        if (userId && !onlineUsers.includes(userId)) {
          onlineUsers.push(userId);
        }
      }
    });

    return onlineUsers;
  }
}
