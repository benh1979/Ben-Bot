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
exports.WhatsAppController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp/whatsapp.service");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const apiDto_1 = require("./dto/apiDto");
const event_emitter_1 = require("@nestjs/event-emitter");
let WhatsAppController = class WhatsAppController {
    constructor(whatsAppService, eventEmitter) {
        this.whatsAppService = whatsAppService;
        this.eventEmitter = eventEmitter;
    }
    async createConnection(createConnectionDto) {
        try {
            await this.whatsAppService.createConnection(createConnectionDto.userId);
            return { message: 'Connection initiated successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create connection: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async closeConnection(userId) {
        try {
            await this.whatsAppService.closeConnection(userId);
            return { message: 'Connection closed successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to close connection: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async logout(userId) {
        try {
            await this.whatsAppService.logout(userId);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to logout: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendMessage(sendMessageDto) {
        try {
            await this.whatsAppService.sendMessage(sendMessageDto.userId, sendMessageDto.to, { text: sendMessageDto.content });
            return { message: 'Message sent successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to send message: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getQR(userId) {
        const qr = this.whatsAppService.getQR(userId);
        return { qr };
    }
    async getConnectionStatus(userId) {
        const status = this.whatsAppService.getConnectionStatus(userId);
        return { status };
    }
    async qrStream(userId) {
        return new rxjs_1.Observable(observer => {
            const eventHandler = (qrCode) => {
                observer.next({
                    data: JSON.stringify({
                        qrCode,
                        timestamp: new Date().toISOString(),
                    }),
                });
            };
            this.eventEmitter.on(`qr.${userId}`, eventHandler);
            this.whatsAppService.initializeOrGetQR(userId)
                .then(() => {
                console.log(`QR stream initialized for user ${userId}`);
            })
                .catch(error => {
                console.error(`Error initializing QR stream for user ${userId}:`, error);
                observer.error(new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR));
            });
            return () => {
                this.eventEmitter.removeListener(`qr.${userId}`, eventHandler);
                console.log(`QR stream closed for user ${userId}`);
            };
        });
    }
    isConnected(userId) {
        const connected = this.whatsAppService.isConnected(userId);
        return { connected };
    }
    async generatePairingCode(generatePairingCodeDto) {
        try {
            if (this.whatsAppService.isConnected(generatePairingCodeDto.userId)) {
                throw new common_1.HttpException('User is already connected', common_1.HttpStatus.BAD_REQUEST);
            }
            const pairingCode = await this.whatsAppService.generatePairingCode(generatePairingCodeDto.userId, generatePairingCodeDto.phoneNumber);
            return { pairingCode };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async healthCheck() {
        try {
            return {
                status: 'OK',
                message: 'WhatsApp service is running and healthy'
            };
        }
        catch (error) {
            throw new common_1.HttpException('Service is unhealthy: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserDetails(userId) {
        try {
            const userDetails = await this.whatsAppService.getUserDetails(userId);
            return userDetails;
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async getSavedGroups(userId) {
        try {
            const groups = await this.whatsAppService.getSavedGroups(userId);
            return { success: true, groups };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WhatsAppController = WhatsAppController;
__decorate([
    (0, common_1.Post)('connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new WhatsApp connection' }),
    (0, swagger_1.ApiBody)({ type: apiDto_1.CreateConnectionDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Connection initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "createConnection", null);
__decorate([
    (0, common_1.Post)('close-connection/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Close a WhatsApp connection for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection closed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "closeConnection", null);
__decorate([
    (0, common_1.Post)('logout/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout a user from WhatsApp' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('send-message'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a WhatsApp message' }),
    (0, swagger_1.ApiBody)({ type: apiDto_1.SendMessageDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('qr/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code for WhatsApp Web' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getQR", null);
__decorate([
    (0, common_1.Get)('status/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get connection status for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection status retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getConnectionStatus", null);
__decorate([
    (0, common_1.Sse)('qr-stream/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Stream QR code updates for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code stream established' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or user already connected' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "qrStream", null);
__decorate([
    (0, common_1.Get)('is-connected/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a user is connected' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection status retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], WhatsAppController.prototype, "isConnected", null);
__decorate([
    (0, common_1.Post)('generate-pairing-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a pairing code for WhatsApp Web' }),
    (0, swagger_1.ApiBody)({ type: apiDto_1.GeneratePairingCodeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pairing code generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already connected' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "generatePairingCode", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check the health status of the WhatsApp service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Service is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Get)('groups/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getSavedGroups", null);
exports.WhatsAppController = WhatsAppController = __decorate([
    (0, swagger_1.ApiTags)('WhatsApp'),
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        event_emitter_1.EventEmitter2])
], WhatsAppController);
//# sourceMappingURL=app.controller.js.map