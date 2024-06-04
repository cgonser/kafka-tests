import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: 'FIBO_SERVICE',
  //       transport: Transport.KAFKA,
  //       options: {
  //         client: {
  //           clientId: 'producer',
  //           brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
  //         },
  //         consumer: {
  //           groupId: 'kafka-microservices',
  //         },
  //       },
  //     },
  //   ]),
  // ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
