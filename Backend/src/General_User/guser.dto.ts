
import { IsString, IsEmail, Matches } from 'class-validator';


export class UserDTO {
 @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name should only contain alphabets' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*\d).*$/, { message: 'Password must contain at least one numeric character' })
  password: string;

  @IsString()
  @Matches(/^018-\d{7}$/, { message: 'Phone number must match the format 018-#######' })
  phoneNumber: string;
}
