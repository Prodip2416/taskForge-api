import { IsInt, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;
}