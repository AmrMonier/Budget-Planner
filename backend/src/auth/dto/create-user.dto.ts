import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

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
