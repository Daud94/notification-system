import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateNotificationPreferencesDto } from './dto/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../interfaces/request.interface';
import { TokenDto } from './dto/token.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('notification-preferences')
  updateNotificationPreferences(
    @Body() preferences: UpdateNotificationPreferencesDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.updateNotificationPreferences(
      req.user.id,
      preferences,
    );
  }

  @Put('fcm-token')
  updateFcmToken(@Request() req: RequestWithUser, @Body() payload: TokenDto) {
    return this.userService.updateFcmToken(req.user.id, payload.token);
  }
}
