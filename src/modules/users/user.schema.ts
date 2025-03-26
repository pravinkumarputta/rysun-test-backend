import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  emailId: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user'] })
  role: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
