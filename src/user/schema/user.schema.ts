import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  user_email: string;

  @Prop({ required: true })
  user_password: string;

  @Prop()
  hidden: boolean;

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
