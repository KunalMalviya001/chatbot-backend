import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  user_email: string;

  @Prop({
    type: [
      {
        user_message: { type: String, required: true },
        bot_message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  chat_history: {
    user_message: string;
    bot_message: string;
    createdAt: Date;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
