import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemRewardDto {
  @ApiProperty({ example: 'user123', description: 'The user ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'option123', description: 'The reward option ID' })
  @IsString()
  optionId: string;
} 