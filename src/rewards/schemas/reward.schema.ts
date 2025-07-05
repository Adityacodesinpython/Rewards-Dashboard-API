import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: false, updatedAt: 'updatedAt' } })
export class Reward extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, default: 0 })
  totalPoints: number;

  @Prop()
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 