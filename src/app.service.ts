import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
  ) {}
  async onModuleInit() {
    console.log(
      'AppService initialized, notification queue:',
      this.notificationQueue.name,
    );
    const client = await this.notificationQueue.client;

    client.on('connect', () => console.log('Redis connected'));
    client.on('ready', () => console.log('Ready'));
    client.on('error', () => console.log('Error'));
    client.on('end', () => console.log('Connection closed'));
  }
}
