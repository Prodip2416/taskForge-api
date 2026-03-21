import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateProjectDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(500, { message: 'Title too long (max 100 chars)' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description too long (max 1000 chars)' })
  description?: string;
}
