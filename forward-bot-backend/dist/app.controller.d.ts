import { MessageEvent } from '@nestjs/common';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface CreateConnectionDtoType {
    userId: string;
    pairingCode?: string;
}
interface SendMessageDtoType {
    userId: string;
    to: string;
    content: string;
}
interface GeneratePairingCodeDtoType {
    userId: string;
    phoneNumber: string;
}
export declare class WhatsAppController {
    private readonly whatsAppService;
    private eventEmitter;
    constructor(whatsAppService: WhatsAppService, eventEmitter: EventEmitter2);
    createConnection(createConnectionDto: CreateConnectionDtoType): Promise<{
        message: string;
    }>;
    closeConnection(userId: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    sendMessage(sendMessageDto: SendMessageDtoType): Promise<{
        message: string;
    }>;
    getQR(userId: string): Promise<{
        qr: string | null;
    }>;
    getConnectionStatus(userId: string): Promise<{
        status: any;
    }>;
    qrStream(userId: string): Promise<Observable<MessageEvent>>;
    isConnected(userId: string): {
        connected: boolean;
    };
    generatePairingCode(generatePairingCodeDto: GeneratePairingCodeDtoType): Promise<{
        pairingCode: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        message: string;
    }>;
    getUserDetails(userId: string): Promise<string | {
        name: string;
        number: string;
        avatar: string;
    } | {
        error: any;
    }>;
    getSavedGroups(userId: string): Promise<{
        success: boolean;
        groups: any[];
    }>;
}
export {};
