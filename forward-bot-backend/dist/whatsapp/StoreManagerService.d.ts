import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SqliteHelper } from './sqlite.helper';
export interface ChatData {
    userID: string;
    fromJid: string;
    toJid: string;
    fromJidName: string;
    toJidName: string;
    timestamp: string;
}
export interface ChatDataWithId extends ChatData {
    id: string;
}
export declare class ChatService implements OnModuleInit, OnModuleDestroy {
    private readonly sqliteHelper;
    private readonly logger;
    private readonly dbPath;
    constructor(sqliteHelper: SqliteHelper);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeDatabase;
    saveChat(chatData: ChatData[]): Promise<ChatDataWithId[]>;
    readChat(userID?: string, id?: string): Promise<ChatDataWithId[]>;
    listUserChats(userID: string): Promise<ChatDataWithId[]>;
    deleteChat(userID?: string, id?: string): Promise<boolean>;
}
