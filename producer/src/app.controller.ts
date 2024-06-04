import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Kafka, Partitioners } from 'kafkajs';

@Controller()
export class AppController implements OnModuleInit {
  private kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'producer',
      brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
      retry: {
        initialRetryTime: 100, // the initial backoff time in milliseconds
        retries: 5, // the maximum number of retries
        maxRetryTime: 3600000,
      },
      idempotent: false,
    });
  }

  private async publishFiboRequests() {
    const requests = [];
    await this.producer.connect();

    for (let i = 1; i <= 40; i++) {
      requests.push(this.sendMessage(i));
    }

    await Promise.all(requests);

    await this.producer.disconnect();
  }

  private async sendMessage(value) {
    return new Promise((resolve, reject) => {
      const messages = [
        {
          key: randomUUID(),
          value: JSON.stringify({ num: value }),
        },
      ];

      console.log(messages);

      this.producer.send(
        {
          topic: 'fibo',
          messages: messages,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  @Get('/generate')
  async getFibonacci() {
    this.publishFiboRequests(); // Fire and forget
    return 'Fibonacci requests have been published to Kafka.';
  }

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'producer',
      brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
    });
    const admin = kafka.admin();
    await admin.connect();

    await admin.deleteTopics({
      topics: ['fibo'],
    });

    await admin.createTopics({
      topics: [
        {
          topic: 'fibo',
          numPartitions: 10,
          replicationFactor: 1,
        },
      ],
    });

    await admin.disconnect();
  }
}
