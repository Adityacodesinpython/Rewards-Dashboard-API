import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Reward } from '../schemas/reward.schema';
import { Transaction } from '../schemas/transaction.schema';
import { RewardOption } from '../schemas/reward-option.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(RewardOption.name) private rewardOptionModel: Model<RewardOption>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Only seed if collections are empty
    if ((await this.userModel.countDocuments()) > 0) return;

    // Mock users
    const users = await this.userModel.insertMany([
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ]);

    // Mock rewards
    await this.rewardModel.insertMany([
      { userId: users[0]._id, totalPoints: 1200 },
      { userId: users[1]._id, totalPoints: 800 },
    ]);

    // Mock transactions
    await this.transactionModel.insertMany([
      { userId: users[0]._id, amount: 100, category: 'purchase', pointsEarned: 100, timestamp: new Date() },
      { userId: users[0]._id, amount: 200, category: 'signup', pointsEarned: 200, timestamp: new Date() },
      { userId: users[1]._id, amount: 150, category: 'referral', pointsEarned: 150, timestamp: new Date() },
    ]);

    // Mock reward options
    await this.rewardOptionModel.insertMany([
      { name: '10$ Cashback', costPoints: 1000, description: 'Get $10 cashback', type: 'cashback' },
      { name: '20% Discount Voucher', costPoints: 500, description: '20% off on next purchase', type: 'voucher' },
    ]);
  }
} 