import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetNotificationsQueryDto, CreateNotificationDto } from './dto/notification.dto';
import { SendPushNotificationDto } from './dto/send-push.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo mới' })
  async create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Gửi thông báo tới tất cả người dùng' })
  async broadcast(@Body() body: CreateNotificationDto) {
    return this.notificationsService.broadcast(body);
  }

  @Post('send-push')
  @ApiOperation({ 
    summary: 'Gửi push notification đơn giản (chỉ cần accountId, title, body)',
    description: 'Gửi push notification trực tiếp tới tất cả devices của user mà không tạo notification record trong DB'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Push notification đã được gửi',
    schema: {
      example: {
        sent: true,
        devicesCount: 2
      }
    }
  })
  async sendPush(@Body() dto: SendPushNotificationDto) {
    return this.notificationsService.sendPushOnly(
      dto.accountId,
      dto.title,
      dto.body,
      dto.data
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo với filter' })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  async getNotifications(
    @GetUser() user: any,
    @Query() query: GetNotificationsQueryDto,
  ) {
    return this.notificationsService.findAll(user.userId, query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Lấy 5 thông báo gần nhất' })
  async getSummary(@GetUser() user: any) {
    const notifications = await this.notificationsService.getByAccountId(
      user.userId,
    );
    return notifications.slice(0, 5);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Đếm số thông báo chưa đọc' })
  @ApiResponse({ status: 200, description: 'Số lượng thông báo chưa đọc' })
  async getUnreadCount(@GetUser() user: any, @Query('storeId') storeId?: string) {
    if (storeId) {
      // Count unread for specific store
      const result = await this.notificationsService.findAll(user.userId, {
        storeId,
        page: 1,
        limit: 1,
      });
      const unreadCount = await this.notificationsService
        .getByAccountId(user.userId, true)
        .then((notifications) =>
          notifications.filter((n) => n.storeId === storeId).length,
        );
      return { count: unreadCount };
    }
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đã đánh dấu thông báo' })
  async markAsRead(@Param('id') id: string, @GetUser() user: any) {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đã đánh dấu tất cả' })
  async markAllAsRead(@GetUser() user: any, @Query('storeId') storeId?: string) {
    if (storeId) {
      // Mark all as read for specific store
      await this.notificationsService.markAllAsReadForStore(user.userId, storeId);
      return { message: 'Đã đánh dấu tất cả thông báo của cửa hàng là đã đọc' };
    }
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiResponse({ status: 200, description: 'Đã xóa thông báo' })
  async delete(@Param('id') id: string, @GetUser() user: any) {
    return this.notificationsService.delete(id, user.userId);
  }
}
