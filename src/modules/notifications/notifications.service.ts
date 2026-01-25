import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // Create notification
  async create(data: Partial<Notification>) {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  // Get all notifications for a user
  async getByAccountId(accountId: string, unreadOnly: boolean = false) {
    const where: any = { accountId };
    if (unreadOnly) {
      where.isRead = false;
    }

    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // Mark notification as read
  async markAsRead(id: string, accountId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, accountId },
    });

    if (!notification) {
      return null;
    }

    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  // Mark all notifications as read for a user
  async markAllAsRead(accountId: string) {
    await this.notificationRepository.update(
      { accountId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
  }

  // Delete notification
  async delete(id: string, accountId: string) {
    await this.notificationRepository.delete({ id, accountId });
    return { message: 'Đã xóa thông báo' };
  }

  // Get unread count
  async getUnreadCount(accountId: string) {
    const count = await this.notificationRepository.count({
      where: { accountId, isRead: false },
    });
    return { count };
  }

  // Create notifications for multiple users
  async createMany(data: Partial<Notification>[], accountIds: string[]) {
    const notifications = accountIds.map((accountId) =>
      this.notificationRepository.create({ ...data[0], accountId }),
    );
    return this.notificationRepository.save(notifications);
  }

  // Send notification to ALL active users
  async broadcast(data: Partial<Notification>) {
    const accounts = await this.accountRepository.find({
      where: { status: 'active' as any },
    });
    const accountIds = accounts.map((a) => a.id);

    const notifications = accountIds.map((accountId) =>
      this.notificationRepository.create({ ...data, accountId }),
    );

    // Save in chunks if there are many users to avoid DB limits
    const chunkSize = 100;
    for (let i = 0; i < notifications.length; i += chunkSize) {
      await this.notificationRepository.save(
        notifications.slice(i, i + chunkSize),
      );
    }

    return {
      message: `Đã gửi thông báo tới ${notifications.length} người dùng`,
      count: notifications.length,
    };
  }
}
