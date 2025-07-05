import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RewardOption extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  costPoints: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  type: string;
}

export const RewardOptionSchema = SchemaFactory.createForClass(RewardOption); 