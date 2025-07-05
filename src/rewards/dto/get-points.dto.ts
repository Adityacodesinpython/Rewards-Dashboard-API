import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPointsDto {
  @ApiProperty({ example: 'user123', description: 'The user ID' })
  @IsString()
  userId: string;
} 