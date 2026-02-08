import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGateway } from './chat.gateway';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';
import { AddMembersDto } from './dto/add-members.dto';

@ApiTags('Chat Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat-groups')
export class ChatGroupsController {
  constructor(
    private readonly chatGroupsService: ChatGroupsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhóm chat mới' })
  async createGroup(@Body() dto: CreateChatGroupDto, @Request() req) {
    const group = await this.chatGroupsService.createGroup(dto, req.user.userId);

    // Add members to WebSocket rooms
    dto.memberIds.forEach((memberId) => {
      this.chatGateway.joinGroup(memberId, group.id);
    });

    return group;
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhóm chat theo cửa hàng (hoặc tất cả nếu không chỉ định)' })
  @ApiQuery({ name: 'storeId', required: false })
  async getGroupsByStore(@Query('storeId') storeId?: string, @Request() req?) {
    if (storeId) {
      return this.chatGroupsService.getGroupsByStore(storeId, req.user.userId);
    } else {
      return this.chatGroupsService.getAllGroupsForUser(req.user.userId);
    }
  }

  @Get('unread/total')
  @ApiOperation({ summary: 'Lấy tổng số tin nhắn chưa đọc' })
  async getTotalUnreadCount(@Request() req) {
    return this.chatGroupsService.getTotalUnreadCount(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết nhóm chat' })
  async getGroupDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    return this.chatGroupsService.getGroupDetails(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhóm' })
  async updateGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChatGroupDto,
    @Request() req,
  ) {
    return this.chatGroupsService.updateGroupSettings(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhóm chat' })
  async deleteGroup(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    // TODO: Implement soft delete
    return { message: 'Feature coming soon' };
  }

  // Members
  @Get(':id/members')
  @ApiOperation({ summary: 'Lấy danh sách thành viên' })
  async getMembers(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const members = await this.chatGroupsService.getGroupMembers(id, req.user.userId);

    // Add online status
    const membersWithStatus = members.map((member) => ({
      ...member,
      isOnline: this.chatGateway.isUserOnline(member.accountId),
    }));

    return membersWithStatus;
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Thêm thành viên vào nhóm' })
  async addMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMembersDto,
    @Request() req,
  ) {
    const group = await this.chatGroupsService.addMembers(
      id,
      dto.memberIds,
      req.user.userId,
    );

    // Add new members to WebSocket rooms
    dto.memberIds.forEach((memberId) => {
      this.chatGateway.joinGroup(memberId, id);
    });

    return group;
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Xóa thành viên khỏi nhóm' })
  async removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Request() req,
  ) {
    const result = await this.chatGroupsService.removeMember(
      id,
      memberId,
      req.user.userId,
    );

    // Remove from WebSocket rooms
    this.chatGateway.leaveGroup(memberId, id);

    return result;
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Rời khỏi nhóm' })
  async leaveGroup(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const result = await this.chatGroupsService.leaveGroup(id, req.user.userId);

    // Remove from WebSocket rooms
    this.chatGateway.leaveGroup(req.user.userId, id);

    return result;
  }

  // Messages
  @Get(':id/messages')
  @ApiOperation({ summary: 'Lấy lịch sử tin nhắn' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Request() req,
  ) {
    return this.chatGroupsService.getGroupMessages(id, req.user.userId, page, limit);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu tất cả tin nhắn đã đọc' })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.chatGroupsService.markGroupAsRead(id, req.user.userId);
  }

  // Settings
  @Patch(':id/members/settings')
  @ApiOperation({ summary: 'Cập nhật cài đặt thành viên (màu chat, thông báo)' })
  async updateMemberSettings(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('chatColor') chatColor?: string,
    @Body('notificationsEnabled') notificationsEnabled?: boolean,
    @Request() req?,
  ) {
    return this.chatGroupsService.updateMemberSettings(
      id,
      req.user.userId,
      { chatColor, notificationsEnabled },
    );
  }

  // Media & Search
  @Get(':id/media')
  @ApiOperation({ summary: 'Lấy file và phương tiện trong nhóm' })
  @ApiQuery({ name: 'type', required: false, enum: ['image', 'video', 'document', 'all'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getGroupMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('type') type: string = 'all',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Request() req,
  ) {
    return this.chatGroupsService.getGroupMedia(id, req.user.userId, type, page, limit);
  }

  @Get(':id/messages/search')
  @ApiOperation({ summary: 'Tìm kiếm tin nhắn trong nhóm' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async searchMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Request() req,
  ) {
    return this.chatGroupsService.searchMessages(id, req.user.userId, query, page, limit);
  }
}
