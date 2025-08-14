import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('DATABASE_URL'),
        type: 'postgres',
        ssl: {
          rejectUnauthorized: false, // Adjust based on your SSL requirements
        },
        entities: [User, Product], // Add Product entity here when needed
        synchronize: true, // Be careful with this in production
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    NotificationModule,
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
