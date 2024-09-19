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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const StoreManagerService_1 = require("./whatsapp/StoreManagerService");
let ChatController = class ChatController {
    constructor(fileManagerService) {
        this.fileManagerService = fileManagerService;
    }
    async saveChat(chatData) {
        const savedChat = await this.fileManagerService.saveChat(chatData);
        return { message: 'Chat saved successfully', chat: savedChat };
    }
    async getChat(userId, chatId) {
        const chat = await this.fileManagerService.readChat(userId, chatId);
        if (!chat) {
            return { message: 'Chat not found' };
        }
        return { chat };
    }
    async listChats(userId) {
        const chats = await this.fileManagerService.listUserChats(userId);
        return { chats };
    }
    async deleteChat(userId, chatId) {
        const deleted = await this.fileManagerService.deleteChat(userId, chatId);
        if (deleted) {
            return { message: 'Chat deleted successfully' };
        }
        return { message: 'Chat not found or could not be deleted' };
    }
    async deleteChatById(chatId) {
        const deleted = await this.fileManagerService.deleteChat(undefined, chatId);
        if (deleted) {
            return { message: 'Chat deleted successfully' };
        }
        return { message: 'Chat not found or could not be deleted' };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "saveChat", null);
__decorate([
    (0, common_1.Get)(':userId/:chatId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChat", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listChats", null);
__decorate([
    (0, common_1.Delete)(':userId/:chatId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteChat", null);
__decorate([
    (0, common_1.Delete)(':chatId'),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteChatById", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [StoreManagerService_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map