import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';
import { RewardOption, RewardOptionSchema } from './schemas/reward-option.schema';
import { User, UserSchema } from './schemas/user.schema';
import { SeedService } from './seed/seed.service';
import { RewardsGateway } from './rewards.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Redemption.name, schema: RedemptionSchema },
      { name: RewardOption.name, schema: RewardOptionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService, SeedService, RewardsGateway],
})
export class RewardsModule {}
