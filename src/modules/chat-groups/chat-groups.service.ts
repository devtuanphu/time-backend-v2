import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chat-group.entity';
import { ChatGroupMember } from './entities/chat-group-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';

@Injectable()
export class ChatGroupsService {
  constructor(
    @InjectRepository(ChatGroup)
    private chatGroupRepository: Repository<ChatGroup>,
    @InjectRepository(ChatGroupMember)
    private chatGroupMemberRepository: Repository<ChatGroupMember>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  // Create group with members
  async createGroup(dto: CreateChatGroupDto, userId: string) {
    const group = this.chatGroupRepository.create({
      name: dto.name,
      storeId: dto.storeId,
      createdBy: userId,
      messagePermission: dto.messagePermission || 'everyone',
      customSenderIds: dto.customSenderIds || [],
    });

    await this.chatGroupRepository.save(group);

    // Add creator as member
    const creatorMember = this.chatGroupMemberRepository.create({
      groupId: group.id,
      accountId: userId,
      status: 'active',
    });
    await this.chatGroupMemberRepository.save(creatorMember);

    // Add other members
    if (dto.memberIds && dto.memberIds.length > 0) {
      const members = dto.memberIds
        .filter((id) => id !== userId) // Don't duplicate creator
        .map((accountId) =>
          this.chatGroupMemberRepository.create({
            groupId: group.id,
            accountId,
            status: 'active',
          }),
        );

      if (members.length > 0) {
        await this.chatGroupMemberRepository.save(members);
      }
    }

    return this.getGroupDetails(group.id, userId);
  }

  // Get groups by store
  async getGroupsByStore(storeId: string, userId: string) {
    const groups = await this.chatGroupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.account', 'account')
      .leftJoinAndSelect('member.employeeProfile', 'employeeProfile')
      .leftJoin('group.messages', 'message')
      .addSelect([
        'message.id',
        'message.content',
        'message.messageType',
        'message.senderId',
        'message.createdAt',
      ])
      .where('group.storeId = :storeId', { storeId })
      .andWhere('member.accountId = :userId', { userId })
      .andWhere('member.status = :status', { status: 'active' })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Calculate unread count for each group
    const groupsWithUnread = await Promise.all(
      groups.map(async (group) => {
        const member = group.members.find((m) => m.accountId === userId);
        const unreadCount = await this.getUnreadCount(group.id, userId, member?.lastReadAt);

        // Get last message
        const lastMessage = group.messages?.[0] || null;

        return {
          ...group,
          unreadCount,
          lastMessage,
        };
      }),
    );

    return groupsWithUnread;
  }

  // Get all groups for user (across all stores)
  async getAllGroupsForUser(userId: string) {
    const groups = await this.chatGroupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.account', 'account')
      .leftJoinAndSelect('member.employeeProfile', 'employeeProfile')
      .leftJoin('group.messages', 'message')
      .addSelect([
        'message.id',
        'message.content',
        'message.messageType',
        'message.senderId',
        'message.createdAt',
      ])
      .where('member.accountId = :userId', { userId })
      .andWhere('member.status = :status', { status: 'active' })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Calculate unread count for each group
    const groupsWithUnread = await Promise.all(
      groups.map(async (group) => {
        const member = group.members.find((m) => m.accountId === userId);
        const unreadCount = await this.getUnreadCount(group.id, userId, member?.lastReadAt);

        // Get last message
        const lastMessage = group.messages?.[0] || null;

        return {
          ...group,
          unreadCount,
          lastMessage,
        };
      }),
    );

    return groupsWithUnread;
  }

  // Get total unread count across all groups
  async getTotalUnreadCount(userId: string) {
    const groups = await this.getUserGroups(userId);
    
    let totalUnread = 0;
    for (const group of groups) {
      const member = await this.chatGroupMemberRepository.findOne({
        where: { groupId: group.id, accountId: userId, status: 'active' },
      });
      
      if (member) {
        const unreadCount = await this.getUnreadCount(
          group.id,
          userId,
          member.lastReadAt
        );
        totalUnread += unreadCount;
      }
    }
    
    return { totalUnread };
  }

  // Get group details
  async getGroupDetails(groupId: string, userId: string) {
    const group = await this.chatGroupRepository.findOne({
      where: { id: groupId },
      relations: ['members', 'members.account', 'members.employeeProfile', 'creator'],
    });

    if (!group) {
      throw new NotFoundException('Nhóm chat không tồn tại');
    }

    // Check if user is member
    const isMember = group.members.some(
      (m) => m.accountId === userId && m.status === 'active',
    );

    if (!isMember) {
      throw new ForbiddenException('Bạn không phải thành viên của nhóm này');
    }

    return group;
  }

  // Get messages with pagination
  async getGroupMessages(
    groupId: string,
    userId: string,
    page = 1,
    limit = 50,
  ) {
    // Verify membership
    await this.verifyMembership(groupId, userId);

    const [messages, total] = await this.chatMessageRepository.findAndCount({
      where: { groupId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: messages.reverse(), // Reverse to show oldest first
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Send message
  async sendMessage(dto: SendMessageDto, userId: string) {
    // Verify membership and permissions
    await this.verifyMembership(dto.groupId, userId);
    await this.verifyMessagePermission(dto.groupId, userId);

    const message = this.chatMessageRepository.create({
      groupId: dto.groupId,
      senderId: userId,
      content: dto.content,
      messageType: dto.messageType || 'text',
      attachmentUrl: dto.attachmentUrl,
      attachmentName: dto.attachmentName,
      attachmentSize: dto.attachmentSize,
      readBy: [userId], // Sender has read it
    });

    await this.chatMessageRepository.save(message);

    // Load sender info
    return this.chatMessageRepository.findOne({
      where: { id: message.id },
      relations: ['sender'],
    });
  }

  // Mark message as read
  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.chatMessageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Tin nhắn không tồn tại');
    }

    // Verify membership
    await this.verifyMembership(message.groupId, userId);

    // Add user to readBy if not already there
    if (!message.readBy) {
      message.readBy = [];
    }

    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await this.chatMessageRepository.save(message);
    }

    return message;
  }

  // Mark all messages in group as read
  async markGroupAsRead(groupId: string, userId: string) {
    await this.verifyMembership(groupId, userId);

    // Update lastReadAt for member
    await this.chatGroupMemberRepository.update(
      { groupId, accountId: userId },
      { lastReadAt: new Date() },
    );

    return { success: true };
  }

  // Update group settings
  async updateGroupSettings(
    groupId: string,
    dto: UpdateChatGroupDto,
    userId: string,
  ) {
    const group = await this.getGroupDetails(groupId, userId);

    // Only creator can update settings
    if (group.createdBy !== userId) {
      throw new ForbiddenException('Chỉ người tạo nhóm mới có thể chỉnh sửa');
    }

    Object.assign(group, dto);
    await this.chatGroupRepository.save(group);

    return group;
  }

  // Add members
  async addMembers(groupId: string, memberIds: string[], userId: string) {
    const group = await this.getGroupDetails(groupId, userId);

    // Only creator can add members
    if (group.createdBy !== userId) {
      throw new ForbiddenException('Chỉ người tạo nhóm mới có thể thêm thành viên');
    }

    const newMembers = memberIds.map((accountId) =>
      this.chatGroupMemberRepository.create({
        groupId,
        accountId,
        status: 'active',
      }),
    );

    await this.chatGroupMemberRepository.save(newMembers);

    return this.getGroupDetails(groupId, userId);
  }

  // Remove member
  async removeMember(groupId: string, memberId: string, userId: string) {
    const group = await this.getGroupDetails(groupId, userId);

    // Only creator can remove members
    if (group.createdBy !== userId) {
      throw new ForbiddenException('Chỉ người tạo nhóm mới có thể xóa thành viên');
    }

    // Can't remove creator
    if (memberId === group.createdBy) {
      throw new BadRequestException('Không thể xóa người tạo nhóm');
    }

    await this.chatGroupMemberRepository.update(
      { groupId, accountId: memberId },
      { status: 'removed' },
    );

    return { success: true };
  }

  // Leave group
  async leaveGroup(groupId: string, userId: string) {
    const group = await this.getGroupDetails(groupId, userId);

    // Creator can't leave
    if (group.createdBy === userId) {
      throw new BadRequestException('Người tạo nhóm không thể rời nhóm');
    }

    await this.chatGroupMemberRepository.update(
      { groupId, accountId: userId },
      { status: 'left' },
    );

    return { success: true };
  }

  // Get group members
  async getGroupMembers(groupId: string, userId: string) {
    await this.verifyMembership(groupId, userId);

    const members = await this.chatGroupMemberRepository.find({
      where: { groupId, status: 'active' },
      relations: ['account', 'employeeProfile'],
    });

    return members;
  }

  // Get user's groups (for WebSocket)
  async getUserGroups(userId: string) {
    const members = await this.chatGroupMemberRepository.find({
      where: { accountId: userId, status: 'active' },
      relations: ['group'],
    });

    return members.map((m) => m.group);
  }

  // Helper: Verify membership
  private async verifyMembership(groupId: string, userId: string) {
    const member = await this.chatGroupMemberRepository.findOne({
      where: { groupId, accountId: userId, status: 'active' },
    });

    if (!member) {
      throw new ForbiddenException('Bạn không phải thành viên của nhóm này');
    }

    return member;
  }

  // Helper: Verify message permission
  private async verifyMessagePermission(groupId: string, userId: string) {
    const group = await this.chatGroupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Nhóm chat không tồn tại');
    }

    // Everyone can send
    if (group.messagePermission === 'everyone') {
      return true;
    }

    // Only admin
    if (group.messagePermission === 'admin_only') {
      if (group.createdBy !== userId) {
        throw new ForbiddenException('Chỉ quản trị viên mới có thể gửi tin nhắn');
      }
      return true;
    }

    // Custom list
    if (group.messagePermission === 'custom') {
      if (!group.customSenderIds || !group.customSenderIds.includes(userId)) {
        throw new ForbiddenException('Bạn không có quyền gửi tin nhắn trong nhóm này');
      }
      return true;
    }

    return true;
  }

  // Helper: Get unread count
  private async getUnreadCount(
    groupId: string,
    userId: string,
    lastReadAt?: Date,
  ) {
    if (!lastReadAt) {
      // Never read, count all messages
      return this.chatMessageRepository.count({
        where: { groupId },
      });
    }

    return this.chatMessageRepository.count({
      where: {
        groupId,
        createdAt: { $gt: lastReadAt } as any,
      },
    });
  }

  // Update member settings (color, notifications)
  async updateMemberSettings(
    groupId: string,
    userId: string,
    settings: { chatColor?: string; notificationsEnabled?: boolean },
  ) {
    const member = await this.chatGroupMemberRepository.findOne({
      where: { groupId, accountId: userId, status: 'active' },
    });

    if (!member) {
      throw new NotFoundException('Bạn không phải thành viên của nhóm này');
    }

    if (settings.chatColor !== undefined) {
      member.chatColor = settings.chatColor;
    }

    if (settings.notificationsEnabled !== undefined) {
      member.notificationsEnabled = settings.notificationsEnabled;
    }

    await this.chatGroupMemberRepository.save(member);

    return {
      id: member.id,
      chatColor: member.chatColor,
      notificationsEnabled: member.notificationsEnabled,
    };
  }

  // Get group media (images, videos, documents)
  async getGroupMedia(
    groupId: string,
    userId: string,
    type: string = 'all',
    page: number = 1,
    limit: number = 20,
  ) {
    // Verify membership
    await this.getGroupDetails(groupId, userId);

    const queryBuilder = this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.groupId = :groupId', { groupId })
      .andWhere('message.attachmentUrl IS NOT NULL')
      .orderBy('message.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // Filter by type
    if (type !== 'all') {
      if (type === 'image') {
        queryBuilder.andWhere('message.messageType = :type', { type: 'image' });
      } else if (type === 'video') {
        // Videos are stored as 'file' type, need to check attachment name
        queryBuilder.andWhere('message.messageType = :type', { type: 'file' });
      } else if (type === 'document') {
        queryBuilder.andWhere('message.messageType = :type', { type: 'file' });
      }
    }

    const [messages, total] = await queryBuilder.getManyAndCount();

    const media = messages.map((msg) => ({
      id: msg.id,
      type: msg.messageType === 'image' ? 'image' : msg.messageType === 'file' ? 'document' : 'document',
      url: msg.attachmentUrl,
      fileName: msg.attachmentName || 'Unknown',
      fileSize: msg.attachmentSize || 0,
      createdAt: msg.createdAt,
      sender: {
        id: msg.sender.id,
        fullName: msg.sender.fullName,
        avatar: msg.sender.avatar,
      },
    }));

    return {
      media,
      total,
      page,
      limit,
    };
  }

  // Search messages in group
  async searchMessages(
    groupId: string,
    userId: string,
    query: string,
    page: number = 1,
    limit: number = 20,
  ) {
    // Verify membership
    await this.getGroupDetails(groupId, userId);

    const [messages, total] = await this.chatMessageRepository.findAndCount({
      where: {
        groupId,
        content: { $like: `%${query}%` } as any,
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      messages,
      total,
      page,
      limit,
    };
  }
}
