import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroupsController } from './chat-groups.controller';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGateway } from './chat.gateway';
import { ChatGroup } from './entities/chat-group.entity';
import { ChatGroupMember } from './entities/chat-group-member.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatGroup, ChatGroupMember, ChatMessage]),
  ],
  controllers: [ChatGroupsController],
  providers: [ChatGroupsService, ChatGateway],
  exports: [ChatGroupsService, ChatGateway],
})
export class ChatGroupsModule {}
