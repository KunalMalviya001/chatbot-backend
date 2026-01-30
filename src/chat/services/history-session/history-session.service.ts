import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatHistorySession,
  ChatHistorySessionDocument,
} from '../../schemas/chatHistorySession.schema';

@Injectable()
export class HistorySessionService {
  constructor(
    @InjectModel(ChatHistorySession.name)
    private readonly chatHistorySessionModel: Model<ChatHistorySessionDocument>,
  ) {}

  async createChatHistorySession(email: string, chatId: string) {
    try {
      const objectId = new Types.ObjectId(chatId);

      const session = await this.chatHistorySessionModel.findOne({
        user_email: email,
      });

      if (!session) {
        // Create new session
        await this.chatHistorySessionModel.create({
          user_email: email,
          history_array: [objectId],
        });
      } else {
        // Push ObjectId into array
        session.history_array.push(objectId);
        await session.save();
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to save chat history');
    }
  }

  async getHistoryArray(email: string) {
    const session = await this.chatHistorySessionModel
      .findOne({ user_email: email })
      .populate({
        path: 'history_array',
      })
      .exec();

    return session?.history_array ?? [];
  }
}
