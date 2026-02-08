import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChatGroup } from './chat-group.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string;

  @ManyToOne(() => ChatGroup, (group) => group.messages)
  @JoinColumn({ name: 'group_id' })
  group: ChatGroup;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'sender_id' })
  sender: Account;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['text', 'image', 'file', 'system'],
    default: 'text',
    name: 'message_type',
  })
  messageType: string;

  @Column({ nullable: true, name: 'attachment_url' })
  attachmentUrl: string;

  @Column({ nullable: true, name: 'attachment_name' })
  attachmentName: string;

  @Column({ type: 'bigint', nullable: true, name: 'attachment_size' })
  attachmentSize: number;

  @Column({ type: 'simple-array', nullable: true, name: 'read_by' })
  readBy: string[];
}
