import { IsNotEmpty, IsNumberString, IsStrongPassword } from 'class-validator';
import { ForgetPasswordDto } from './forget-password.dto';

export class ResetPasswordDto extends ForgetPasswordDto {
  @IsNotEmpty()
  @IsNumberString()
  code: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 0,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
    },
    {
      message:
        'password must be at least 8 characters with one lower case letter and one upper case letter',
    },
  )
  password: string;
}
