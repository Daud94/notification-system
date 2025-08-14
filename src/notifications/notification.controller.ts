import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() notificationDto: SendNotificationDto) {
    await this.notificationService.sendNotification(notificationDto.userId, {
      title: notificationDto.title,
      body: notificationDto.body,
      data: notificationDto.data,
    });
    return { success: true };
  }
}
