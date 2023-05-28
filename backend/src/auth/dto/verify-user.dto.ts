import { IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsNumberString()
  user_id: number;
}
