export declare class CreateConnectionDto {
    userId: string;
    pairingCode?: string;
}
export declare class SendMessageDto {
    userId: string;
    to: string;
    content: string;
}
export declare class GeneratePairingCodeDto {
    userId: string;
    phoneNumber: string;
}
