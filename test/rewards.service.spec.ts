import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RewardsService } from '../src/rewards/rewards.service';
import { Reward } from '../src/rewards/schemas/reward.schema';
import { Transaction } from '../src/rewards/schemas/transaction.schema';
import { Redemption } from '../src/rewards/schemas/redemption.schema';
import { RewardOption } from '../src/rewards/schemas/reward-option.schema';

const mockRewardModel = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});
const mockTransactionModel = () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn(),
});
const mockRedemptionModel = () => ({
  create: jest.fn(),
});
const mockRewardOptionModel = () => ({
  findById: jest.fn(),
  find: jest.fn().mockReturnThis(),
  exec: jest.fn(),
});

describe('RewardsService', () => {
  let service: RewardsService;
  let rewardModel: any;
  let transactionModel: any;
  let redemptionModel: any;
  let rewardOptionModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getModelToken(Reward.name), useFactory: mockRewardModel },
        { provide: getModelToken(Transaction.name), useFactory: mockTransactionModel },
        { provide: getModelToken(Redemption.name), useFactory: mockRedemptionModel },
        { provide: getModelToken(RewardOption.name), useFactory: mockRewardOptionModel },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    rewardModel = module.get(getModelToken(Reward.name));
    transactionModel = module.get(getModelToken(Transaction.name));
    redemptionModel = module.get(getModelToken(Redemption.name));
    rewardOptionModel = module.get(getModelToken(RewardOption.name));
  });

  describe('getPoints', () => {
    it('should return total points for a user', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 100 });
      const result = await service.getPoints('u1');
      expect(result).toEqual({ userId: 'u1', totalPoints: 100 });
    });
    it('should throw if user not found', async () => {
      rewardModel.findOne.mockResolvedValue(null);
      await expect(service.getPoints('u1')).rejects.toThrow('User rewards not found');
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for a user', async () => {
      const txs = [{}, {}];
      transactionModel.exec.mockResolvedValue(txs);
      const result = await service.getTransactions('u1', 1, 2);
      expect(result).toBe(txs);
    });
  });

  describe('redeem', () => {
    it('should redeem points if user and option exist and enough points', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 1000, save: jest.fn() });
      rewardOptionModel.findById.mockResolvedValue({ _id: 'o1', name: 'Cashback', costPoints: 500 });
      redemptionModel.create.mockResolvedValue({});
      const result = await service.redeem('u1', 'o1');
      expect(result).toHaveProperty('message', 'Redemption successful');
    });
    it('should throw if user not found', async () => {
      rewardModel.findOne.mockResolvedValue(null);
      await expect(service.redeem('u1', 'o1')).rejects.toThrow('User rewards not found');
    });
    it('should throw if option not found', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 1000, save: jest.fn() });
      rewardOptionModel.findById.mockResolvedValue(null);
      await expect(service.redeem('u1', 'o1')).rejects.toThrow('Reward option not found');
    });
    it('should throw if not enough points', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 100, save: jest.fn() });
      rewardOptionModel.findById.mockResolvedValue({ _id: 'o1', name: 'Cashback', costPoints: 500 });
      await expect(service.redeem('u1', 'o1')).rejects.toThrow('Insufficient reward points');
    });
  });

  describe('redeem (edge cases)', () => {
    it('should allow redeeming with exactly enough points', async () => {
      const save = jest.fn();
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 500, save });
      rewardOptionModel.findById.mockResolvedValue({ _id: 'o1', name: 'Voucher', costPoints: 500 });
      redemptionModel.create.mockResolvedValue({});
      const result = await service.redeem('u1', 'o1');
      expect(result).toHaveProperty('message', 'Redemption successful');
      expect(save).toHaveBeenCalled();
    });
    it('should throw if redeeming with insufficient points', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 100, save: jest.fn() });
      rewardOptionModel.findById.mockResolvedValue({ _id: 'o1', name: 'Voucher', costPoints: 200 });
      await expect(service.redeem('u1', 'o1')).rejects.toThrow('Insufficient reward points');
    });
    it('should throw if redeeming a non-existent reward option', async () => {
      rewardModel.findOne.mockResolvedValue({ userId: 'u1', totalPoints: 1000, save: jest.fn() });
      rewardOptionModel.findById.mockResolvedValue(null);
      await expect(service.redeem('u1', 'badoption')).rejects.toThrow('Reward option not found');
    });
    it('should throw if redeeming for a non-existent user', async () => {
      rewardModel.findOne.mockResolvedValue(null);
      await expect(service.redeem('baduser', 'o1')).rejects.toThrow('User rewards not found');
    });
  });

  describe('getOptions', () => {
    it('should return reward options', async () => {
      const opts = [{}, {}];
      rewardOptionModel.exec.mockResolvedValue(opts);
      const result = await service.getOptions();
      expect(result).toBe(opts);
    });
  });
}); 