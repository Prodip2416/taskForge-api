import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../enum/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*)',
  })
  password: string;

  @IsArray()
  @IsEnum(RoleEnum, { each: true }) 
  @IsOptional()
  roles?: RoleEnum[];
}
