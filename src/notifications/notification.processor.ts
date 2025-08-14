import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotificationService } from './notification.service';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job<any, any, string>) {
    switch (job.name) {
      case 'process-notification':
        console.log(job.data);
        return this.notificationService.processNotification(
          job.data?.payload,
          job.data?.preferences,
        );
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }
}
