import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatHistorySession,
  ChatHistorySessionDocument,
} from '../../schemas/chatHistorySession.schema';
import { Chat } from '../../schemas/chat.schema';

@Injectable()
export class HistorySessionService {
  constructor(
    @InjectModel(ChatHistorySession.name)
    private readonly chatHistorySessionModel: Model<ChatHistorySessionDocument>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async getHistoryArray(email: string) {
    const session = await this.chatHistorySessionModel
      .findOne({ user_email: email })
      .exec();

    return session?.history_array ?? [];
  }

  async createNewSession(email: string) {
    try {
      const newChat = await this.chatModel.create({ user_email: email });
      const session = await this.chatHistorySessionModel.findOne({
        user_email: email,
      });
      if (!session) {
        const newSession = await this.chatHistorySessionModel.create({
          user_email: email,
          history_array: [],
        });
        newSession.history_array.push(newChat._id);
        return await newSession.save();
      }
      session.history_array.push(newChat._id);
      return await session.save();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to save chat history');
    }
  }

  async deleteSession(email: string, sessionId: string) {
    try {
      const session = await this.chatHistorySessionModel.findOne({
        user_email: email,
      });

      if (!session) {
        throw new NotFoundException('User session not found');
      }

      // Check if the sessionId exists in the user's history_array
      const index = session.history_array.findIndex(
        (id) => id.toString() === sessionId,
      );

      if (index === -1) {
        throw new NotFoundException('Chat session not found');
      }

      // Remove the session ID from history_array
      const removedSessionId = session.history_array.splice(index, 1)[0];
      await session.save();

      // Optionally delete the Chat document itself
      await this.chatModel.deleteOne({ _id: removedSessionId });

      return { message: 'Chat session deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete chat session');
    }
  }
}
