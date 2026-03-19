import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  slug: string;
 
  @IsString()
  @MaxLength(1000)
  description: string;
}
