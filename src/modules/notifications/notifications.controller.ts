import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.notificationsService.create(body);
  }

  @Post('broadcast')
  async broadcast(@Body() body: any) {
    return this.notificationsService.broadcast(body);
  }

  @Get()
  async getNotifications(
    @GetUser() user: any,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const unread = unreadOnly === 'true';
    return this.notificationsService.getByAccountId(user.userId, unread);
  }

  @Get('summary')
  async getSummary(@GetUser() user: any) {
    const notifications = await this.notificationsService.getByAccountId(
      user.userId,
    );
    return notifications.slice(0, 5);
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser() user: any) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @GetUser() user: any) {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  @Put('mark-all-read')
  async markAllAsRead(@GetUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @GetUser() user: any) {
    return this.notificationsService.delete(id, user.userId);
  }
}
