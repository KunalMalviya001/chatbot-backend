import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { HistoryService } from './services/history/history.service';

@Injectable()
export class ChatService {
  constructor(private historyService: HistoryService) {}

  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  async getResponse(
    message: string,
    email: string,
    id: string,
  ): Promise<{ reply: string }> {
    try {
      const chatHistory = await this.historyService.getChatHistory(id);

      let aiHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] =
        [];

      if (Array.isArray(chatHistory)) {
        aiHistory = chatHistory.flatMap((entry) => {
          const msgs: { role: 'user' | 'model'; parts: { text: string }[] }[] =
            [];
          if (entry.user_message)
            msgs.push({ role: 'user', parts: [{ text: entry.user_message }] });
          if (entry.bot_message)
            msgs.push({ role: 'model', parts: [{ text: entry.bot_message }] });
          return msgs;
        });
      }

      const systemInstructions = `
You are a game assistant chatbot.

Rules:
- Be short, friendly, and clear.
- If the user asks "what are you?", explain that you are an game assistant.
- If the user greets (hi, hello, hey), reply with "Hi! How may I help you?"
- If the user's message has spelling mistakes, infer the intended game-related question and answer it.
- If user send name then store it.
`;

      const response = await this.ai.models.generateContent({
        // model: 'gemini-2.5-flash',
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: systemInstructions }] },
          ...aiHistory,
          { role: 'user', parts: [{ text: message }] },
        ],
      });

      const bot_message: string =
        response.text || 'Sorry, I could not generate a response.';

      await this.historyService.chatHistory(id, message, bot_message);

      return { reply: bot_message };
    } catch (error) {
      console.error('Error in ChatService.getResponse:', error);
      throw new InternalServerErrorException(
        'Failed to generate chat response',
      );
    }
  }
}
