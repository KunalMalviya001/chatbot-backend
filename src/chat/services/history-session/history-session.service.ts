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
import { Chat, ChatDocument } from '../../schemas/chat.schema';

@Injectable()
export class HistorySessionService {
  constructor(
    @InjectModel(ChatHistorySession.name)
    private readonly chatHistorySessionModel: Model<ChatHistorySessionDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  // Retrieve the history array of chat sessions for a given email.
  async getHistoryArray(email: string) {
    const session = await this.chatHistorySessionModel
      .findOne({ user_email: email })
      .populate('history_array') // Populate the history_array with actual Chat data
      .exec();

    // Return the history array or an empty array if no session found.
    return session?.history_array ?? [];
  }

  // Create a new chat session for the user and add it to their history.
  async createNewSession(email: string) {
    try {
      // Create a new chat document for the user.
      const newChat = await this.chatModel.create({ user_email: email });

      // Find the existing chat history session for the user.
      const session = await this.chatHistorySessionModel.findOne({
        user_email: email,
      });

      if (!session) {
        // If no session exists, create a new session.
        const newSession = await this.chatHistorySessionModel.create({
          user_email: email,
          history_array: [newChat._id], // Add the new chat ID to the history array
        });
        return newSession.save();
      }

      // If session exists, simply add the new chat ID to the history array.
      session.history_array.push(newChat._id);
      return await session.save();
    } catch (error) {
      console.error('Error creating new session:', error);
      throw new InternalServerErrorException(
        'Failed to create a new chat session',
      );
    }
  }

  // Delete a specific chat session by its sessionId from the user's history.
  async deleteSession(email: string, sessionId: string) {
    try {
      // Find the user's chat history session.
      const session = await this.chatHistorySessionModel.findOne({
        user_email: email,
      });

      if (!session) {
        throw new NotFoundException('User session not found');
      }

      // Find the index of the sessionId in the user's history_array.
      const index = session.history_array.findIndex(
        (id) => id.toString() === sessionId,
      );

      if (index === -1) {
        throw new NotFoundException('Chat session not found');
      }

      // Remove the sessionId from the history_array.
      const removedSessionId = session.history_array.splice(index, 1)[0];

      // Save the updated session.
      await session.save();

      // Optionally delete the corresponding Chat document from the chat model.
      await this.chatModel.deleteOne({ _id: removedSessionId });

      return { message: 'Chat session deleted successfully' };
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new InternalServerErrorException('Failed to delete chat session');
    }
  }

  // Additional helper method to get full chat session details if needed.
  async getChatDetails(sessionId: string) {
    try {
      const chat = await this.chatModel.findById(sessionId);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      return chat;
    } catch (error) {
      console.error('Error retrieving chat details:', error);
      throw new InternalServerErrorException('Failed to retrieve chat details');
    }
  }

  // Optional: Helper method to check if a session exists for the user.
  async sessionExists(email: string) {
    return this.chatHistorySessionModel.exists({ user_email: email });
  }
}
