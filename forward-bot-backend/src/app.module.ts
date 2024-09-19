import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WhatsAppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { ChatService } from './whatsapp/StoreManagerService';
import { ChatController } from './chat.controller';
import { SqliteHelper } from './whatsapp/sqlite.helper';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [WhatsAppController, ChatController],
  providers: [AppService, WhatsAppService, ChatService, SqliteHelper],
  exports: [SqliteHelper]
})
export class AppModule { }
