import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LogoutParamsDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  all: boolean;
}
