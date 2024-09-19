import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WASocket, AnyMessageContent, GroupMetadata, WAMessage } from '@whiskeysockets/baileys';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqliteHelper } from './sqlite.helper';
interface ConnectionStatus {
    isConnected: boolean;
    lastConnected: Date | null;
    lastDisconnected: Date | null;
}
interface newGroupMetaData extends GroupMetadata {
    imageUrl?: string | null;
    pendingPfpFetch?: boolean;
}
export declare class WhatsAppService implements OnModuleInit, OnModuleDestroy {
    private eventEmitter;
    private database;
    private connections;
    private qrCallbacks;
    private connectionStatuses;
    private qrCodes;
    private qrPromises;
    private authFolder;
    private waUserGroups;
    private mediaStoragePath;
    constructor(eventEmitter: EventEmitter2, database: SqliteHelper);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeValidConnections;
    createConnection(userId: string): Promise<string>;
    private initializeConnection;
    handleQRCode(userId: any, qr: any, resolve: any): Promise<void>;
    handleClosedConnection(userId: string, lastDisconnect: any): Promise<void>;
    handleOpenConnection(userId: string, socket: WASocket): Promise<void>;
    updateUserGroups(userId: string, socket: WASocket): Promise<void>;
    private mergeGroupData;
    private mergeParticipants;
    getUserData(socket: WASocket): Promise<{
        name: string;
        number: string;
        avatar: string;
    }>;
    updateUserValidity(userId: string, isValid: boolean): Promise<void>;
    insertNewUser(userId: string, userData: any): Promise<void>;
    updateExistingUser(userId: string, userData: any): Promise<void>;
    setupPeriodicReset(userId: string, socket: WASocket): void;
    closeConnection(userId: string): Promise<void>;
    logout(userId: string): Promise<void>;
    sendMessage(userId: string, to: string, message: AnyMessageContent): Promise<void>;
    isConnected(userId: string): boolean;
    getConnectionStatus(userId: string): ConnectionStatus | null;
    generatePairingCode(userId: string, phoneNumber: string): Promise<string>;
    onQR(userId: string, callback: (qr: string) => void): void;
    getQR(userId: string): string | null;
    initializeOrGetQR(userId: string): Promise<string>;
    private generateQRCode;
    private updateConnectionStatus;
    private deleteAuthFolder;
    private validatePhoneNumber;
    getUserDetails(userId: string): Promise<{
        name: string;
        number: string;
        avatar: string;
    } | string>;
    getSavedGroups(userId: string): Promise<newGroupMetaData[]>;
    private handleGroupsUpsert;
    private schedulePfpFetching;
    private handleGroupsUpdate;
    private handleGroupParticipantsUpdate;
    private handleIncomingMessages;
    forwardMessage(m: WAMessage, toId: string, userId: string): Promise<void>;
}
export {};
