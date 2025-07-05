import { Controller, Get, Post, Query, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { GetPointsDto, GetTransactionsDto, RedeemRewardDto } from './dto';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points')
  @ApiOperation({ summary: 'Fetch the total reward points for a user' })
  @ApiResponse({ status: 200, description: 'Total points returned' })
  @UsePipes(new ValidationPipe({ transform: true }))
  getPoints(@Query() query: GetPointsDto) {
    return this.rewardsService.getPoints(query.userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Fetch the last five transactions that earned reward points (supports pagination)' })
  @ApiResponse({ status: 200, description: 'Transactions returned' })
  @UsePipes(new ValidationPipe({ transform: true }))
  getTransactions(@Query() query: GetTransactionsDto) {
    return this.rewardsService.getTransactions(query.userId, query.page, query.limit);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem reward points for a specific option' })
  @ApiBody({ type: RedeemRewardDto })
  @ApiResponse({ status: 200, description: 'Redemption successful' })
  @UsePipes(new ValidationPipe({ transform: true }))
  redeem(@Body() body: RedeemRewardDto) {
    return this.rewardsService.redeem(body.userId, body.optionId);
  }

  @Get('options')
  @ApiOperation({ summary: 'Fetch available reward options' })
  @ApiResponse({ status: 200, description: 'Reward options returned' })
  getOptions() {
    return this.rewardsService.getOptions();
  }
}
