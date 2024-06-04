import { OnModuleInit } from '@nestjs/common';
export declare class AppController implements OnModuleInit {
    private kafka;
    private producer;
    constructor();
    private publishFiboRequests;
    private sendMessage;
    getFibonacci(): Promise<string>;
    onModuleInit(): Promise<void>;
}
