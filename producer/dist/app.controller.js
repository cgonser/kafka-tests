"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const kafkajs_1 = require("kafkajs");
let AppController = class AppController {
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'producer',
            brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
        });
        this.producer = this.kafka.producer({
            createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner,
            retry: {
                initialRetryTime: 100,
                retries: 5,
                maxRetryTime: 3600000,
            },
            idempotent: false,
        });
    }
    async publishFiboRequests() {
        const requests = [];
        await this.producer.connect();
        for (let i = 1; i <= 40; i++) {
            requests.push(this.sendMessage(i));
        }
        await Promise.all(requests);
        await this.producer.disconnect();
    }
    async sendMessage(value) {
        return new Promise((resolve, reject) => {
            const messages = [
                {
                    key: (0, crypto_1.randomUUID)(),
                    value: JSON.stringify({ num: value }),
                },
            ];
            console.log(messages);
            this.producer.send({
                topic: 'fibo',
                messages: messages,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    async getFibonacci() {
        this.publishFiboRequests();
        return 'Fibonacci requests have been published to Kafka.';
    }
    async onModuleInit() {
        const kafka = new kafkajs_1.Kafka({
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
};
__decorate([
    (0, common_1.Get)('/generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFibonacci", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map