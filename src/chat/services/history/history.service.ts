import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../../schemas/chat.schema';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async chatHistory(email: string, userMessage: string, botMessage: string) {
    try {
      const chat = await this.chatModel.findOne({ user_email: email });

      const messageData = {
        user_message: userMessage,
        bot_message: botMessage,
        createdAt: new Date(),
      };
      // console.log(chat);

      if (!chat) {
        // Create new chat document
        await this.chatModel.create({
          user_email: email,
          chat_history: [messageData],
        });
        // console.log('done');
      } else {
        // Append to existing chat_history
        chat.chat_history.push(messageData);
        await chat.save();
        // console.log('done2');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to save chat history');
    }
  }

  async getChatHistory(email: string) {
    try {
      const chat = await this.chatModel.findOne({ user_email: email });
      if (chat) {
        const sendHistory = chat.chat_history;
        return sendHistory;
      } else {
        return 'no data';
      }
    } catch {
      throw new Error('internal server error');
    }
  }
}
