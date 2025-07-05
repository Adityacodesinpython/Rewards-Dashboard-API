import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  pointsEarned: number;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction); 