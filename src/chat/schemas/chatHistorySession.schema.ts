import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChatHistorySessionDocument = HydratedDocument<ChatHistorySession>;

@Schema({ timestamps: true })
export class ChatHistorySession {
  @Prop({ required: true })
  user_email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    default: [],
  })
  history_array: mongoose.Types.ObjectId[];
}

export const ChatHistorySessionSchema =
  SchemaFactory.createForClass(ChatHistorySession);
