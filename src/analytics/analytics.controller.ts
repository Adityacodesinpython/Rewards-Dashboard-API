import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('rewards-distribution')
  @ApiOperation({ summary: 'Get aggregated reward categories distribution' })
  @ApiResponse({ status: 200, description: 'Aggregated reward categories' })
  getRewardsDistribution() {
    return this.analyticsService.getRewardsDistribution();
  }
} 