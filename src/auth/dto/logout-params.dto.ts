import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutParamsDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  all: boolean;
}
