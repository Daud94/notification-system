import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateNotificationPreferencesDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateNotificationPreferences(
    userId: string,
    preferences: UpdateNotificationPreferencesDto,
  ): Promise<UserResponseDto> {
    await this.userRepository.update(userId, {
      notificationPreferences: preferences,
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return plainToClass(UserResponseDto, user);
  }

  async updateFcmToken(
    userId: string,
    fcmToken: string,
  ): Promise<UserResponseDto> {
    await this.userRepository.update(userId, { fcmToken });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return plainToClass(UserResponseDto, user);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToClass(UserResponseDto, user);
  }
}
