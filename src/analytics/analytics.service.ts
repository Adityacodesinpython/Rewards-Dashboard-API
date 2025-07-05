import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../rewards/schemas/transaction.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getRewardsDistribution() {
    return this.transactionModel.aggregate([
      {
        $group: {
          _id: '$category',
          totalPoints: { $sum: '$pointsEarned' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          totalPoints: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
} 