import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HistorySessionService } from './services/history-session/history-session.service';
import { HistoryService } from './services/history/history.service';
import { ChatHistorySession } from './schemas/chatHistorySession.schema';
import { ChatHistorySessionSchema } from './schemas/chatHistorySession.schema';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatHistorySession.name, schema: ChatHistorySessionSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, HistorySessionService, HistoryService],
})
export class ChatModule {}
