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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const sqlite_helper_1 = require("./sqlite.helper");
const uuid_1 = require("uuid");
let ChatService = ChatService_1 = class ChatService {
    constructor(sqliteHelper) {
        this.sqliteHelper = sqliteHelper;
        this.logger = new common_1.Logger(ChatService_1.name);
        this.dbPath = './database/chat_database.sqlite';
    }
    async onModuleInit() {
        await this.sqliteHelper.connect(this.dbPath);
        await this.initializeDatabase();
    }
    async onModuleDestroy() {
        await this.sqliteHelper.close();
    }
    async initializeDatabase() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        userID TEXT,
        fromJid TEXT,
        toJid TEXT,
        fromjidName TEXT,
        toJidName TEXT,
        timestamp TEXT
      )
    `;
        await this.sqliteHelper.runQuery(createTableQuery);
    }
    async saveChat(chatData) {
        const savedChats = [];
        for (const chat of chatData) {
            const existingChat = await this.sqliteHelper.getValues('chats', ['id'], {
                userID: chat.userID,
                fromJid: chat.fromJid,
                toJid: chat.toJid
            });
            if (existingChat.length > 0) {
                this.logger.log(`Chat already exists: ${existingChat[0].id}`);
                continue;
            }
            const reverseChat = await this.sqliteHelper.getValues('chats', ['id'], {
                userID: chat.userID,
                fromJid: chat.toJid,
                toJid: chat.fromJid
            });
            if (reverseChat.length > 0) {
                this.logger.log(`Reverse chat already exists: ${reverseChat[0].id}`);
                continue;
            }
            const id = (0, uuid_1.v4)();
            const chatDataWithId = { ...chat, id };
            const query = `
            INSERT INTO chats (id, userID, fromJid, toJid, fromJidName, toJidName, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
            const params = [
                id,
                chatDataWithId.userID,
                chatDataWithId.fromJid,
                chatDataWithId.toJid,
                chatDataWithId.fromJidName || '',
                chatDataWithId.toJidName || '',
                chatDataWithId.timestamp,
            ];
            try {
                await this.sqliteHelper.runQuery(query, params);
                this.logger.log(`Chat saved successfully: ${id}`);
                savedChats.push(chatDataWithId);
            }
            catch (error) {
                this.logger.error(`Error saving chat: ${error.message}`);
            }
        }
        return savedChats;
    }
    async readChat(userID, id) {
        if (!userID && !id) {
            throw new Error('Either userID or id must be provided');
        }
        let query;
        let params;
        if (userID && id) {
            query = 'SELECT * FROM chats WHERE userID = ? AND id = ?';
            params = [userID, id];
        }
        else if (userID) {
            query = 'SELECT * FROM chats WHERE userID = ?';
            params = [userID];
        }
        else {
            query = 'SELECT * FROM chats WHERE id = ?';
            params = [id];
        }
        const chats = await this.sqliteHelper.getValues(query, params);
        if (chats.length === 0) {
            if (userID && id) {
                this.logger.warn(`Chat not found for user ${userID} and id ${id}`);
            }
            else if (userID) {
                this.logger.warn(`No chats found for user ${userID}`);
            }
            else {
                this.logger.warn(`Chat not found with id ${id}`);
            }
        }
        else {
            this.logger.log(`Found ${chats.length} chat(s)`);
        }
        return chats;
    }
    async listUserChats(userID) {
        const query = 'SELECT * FROM chats WHERE userID = ? ORDER BY timestamp DESC';
        return await this.sqliteHelper.getAll(query, [userID]);
    }
    async deleteChat(userID, id) {
        if (!userID && !id) {
            throw new Error('Either userID or id must be provided');
        }
        let query;
        let params;
        if (userID && id) {
            query = 'DELETE FROM chats WHERE userID = ? AND id = ?';
            params = [userID, id];
        }
        else if (id) {
            query = 'DELETE FROM chats WHERE id = ?';
            params = [id];
        }
        else {
            throw new Error('Invalid parameters for deleteChat');
        }
        try {
            const result = await this.sqliteHelper.runQuery(query, params);
            if (result.changes > 0) {
                this.logger.log(`Chat deleted successfully: ${id ? `id ${id}` : `user ${userID}`}`);
                return true;
            }
            else {
                this.logger.warn(`No chat found to delete: ${id ? `id ${id}` : `user ${userID}`}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Error deleting chat: ${error.message}`);
            throw error;
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sqlite_helper_1.SqliteHelper])
], ChatService);
//# sourceMappingURL=StoreManagerService.js.map