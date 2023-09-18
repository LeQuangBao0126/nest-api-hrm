import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  isNotEmpty,
  isNotEmptyObject,
} from 'class-validator';
import mongoose from 'mongoose';
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Email ko hợp lệ' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  password: string;
  @IsNotEmpty({ message: 'Age không được trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender không được trống' })
  gender: string;
  @IsNotEmpty({ message: 'Address không được trống' })
  address: string;

  // trong back end sẽ thêm role = 'USER'
}

export class CreateUserDto extends RegisterUserDto {
  @IsNotEmpty({ message: 'Role khong được trống' })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
