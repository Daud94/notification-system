import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class NotificationPreferencesDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  inApp: boolean;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{10,14}$/, {
    message: 'Phone number must be in international format (e.g., +1234567890)',
  })
  phoneNumber?: string;

  @IsOptional()
  notificationPreferences?: NotificationPreferencesDto;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateNotificationPreferencesDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  inApp: boolean;
}

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };

  @Expose()
  fcmToken?: string;
}

export class AuthResponseDto {
  @Expose()
  token: string;
}
