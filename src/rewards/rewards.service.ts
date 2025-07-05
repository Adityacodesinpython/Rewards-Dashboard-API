import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { Transaction } from './schemas/transaction.schema';
import { Redemption } from './schemas/redemption.schema';
import { RewardOption } from './schemas/reward-option.schema';
import { RewardsGateway } from './rewards.gateway';
import { Cache } from 'cache-manager';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Redemption.name) private redemptionModel: Model<Redemption>,
    @InjectModel(RewardOption.name) private rewardOptionModel: Model<RewardOption>,
    private readonly rewardsGateway: RewardsGateway,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async getPoints(userId: string) {
    const reward = await this.rewardModel.findOne({ userId });
    if (!reward) throw new NotFoundException('User rewards not found');
    return { userId, totalPoints: reward.totalPoints };
  }

  async getTransactions(userId: string, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const transactions = await this.transactionModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return transactions;
  }

  async redeem(userId: string, optionId: string) {
    const reward = await this.rewardModel.findOne({ userId });
    if (!reward) throw new NotFoundException('User rewards not found');
    const option = await this.rewardOptionModel.findById(optionId);
    if (!option) throw new NotFoundException('Reward option not found');
    if (reward.totalPoints < option.costPoints) {
      throw new BadRequestException('Insufficient reward points');
    }
    reward.totalPoints -= option.costPoints;
    await reward.save();
    this.rewardsGateway.emitRewardPointsUpdate(userId, reward.totalPoints);
    await this.redemptionModel.create({
      userId,
      pointsRedeemed: option.costPoints,
      rewardType: option.name,
      timestamp: new Date(),
    });
    return { message: 'Redemption successful', rewardType: option.name, pointsRedeemed: option.costPoints };
  }

  async getOptions() {
    const cacheKey = 'reward_options';
    let options = await this.cacheManager.get(cacheKey);
    if (!options) {
      options = await this.rewardOptionModel.find().exec();
      await this.cacheManager.set(cacheKey, options, 60); // cache for 60 seconds
    }
    return options;
  }
}
