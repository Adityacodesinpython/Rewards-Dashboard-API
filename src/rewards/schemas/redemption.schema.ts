import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Redemption extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  pointsRedeemed: number;

  @Prop({ required: true })
  rewardType: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption); 