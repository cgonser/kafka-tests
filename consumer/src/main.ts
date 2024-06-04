import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${uuidv4()}`,
          brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
        },
        consumer: {
          groupId: 'consumer',
          sessionTimeout: 900000,
          heartbeatInterval: 10000,
          maxWaitTimeInMs: 3000,
          //max.poll.records: should be less than 500
          retry: {
            retries: 30,
          },
        },
        run: {
          autoCommit: false,
          // eachBatchAutoResolve: true,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
