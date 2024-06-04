import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private fibonacci(n: number) {
    return n < 1
      ? 0
      : n <= 2
      ? 1
      : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @MessagePattern('fibo')
  async getFibonacci(
    @Payload() message: { num: number },
    @Ctx() context: KafkaContext,
  ) {
    await context.getConsumer().commitOffsets([
      {
        topic: context.getTopic(),
        partition: context.getPartition(),
        offset: (Number(context.getMessage().offset) + 1).toString(),
      },
    ]);

    // const originalMessage = context.getMessage();
    const partition = context.getPartition();

    const { num } = message;
    console.log('message received', { num: num, partition: partition });
    await this.delay(1500); // Adding a 5-second delay
    console.log('message processed', { num: num, partition: partition });
    return this.fibonacci(num);
  }
}
