import { ChatData, ChatService } from './whatsapp/StoreManagerService';
export declare class ChatController {
    private readonly fileManagerService;
    constructor(fileManagerService: ChatService);
    saveChat(chatData: ChatData[]): Promise<{
        message: string;
        chat: import("./whatsapp/StoreManagerService").ChatDataWithId[];
    }>;
    getChat(userId: string, chatId: string): Promise<{
        message: string;
        chat?: undefined;
    } | {
        chat: import("./whatsapp/StoreManagerService").ChatDataWithId[];
        message?: undefined;
    }>;
    listChats(userId: string): Promise<{
        chats: import("./whatsapp/StoreManagerService").ChatDataWithId[];
    }>;
    deleteChat(userId: string, chatId: string): Promise<{
        message: string;
    }>;
    deleteChatById(chatId: string): Promise<{
        message: string;
    }>;
}
