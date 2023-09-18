import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Company {
  @IsNotEmpty()
  @IsString({ message: 'id cong ty phải là string' })
  _id: string;

  @IsNotEmpty({ message: 'ten cong ty ko dc rỗng' })
  @IsString()
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên job không được rỗng' })
  name: string;

  @IsNotEmpty({ message: 'Skills không được rỗng' })
  @IsArray({ message: 'Phải là 1 mảng string ' })
  skills: string[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'salary khong dc rong' })
  salary: number;

  @IsNotEmpty({ message: 'quantity khong dc rong' })
  @IsNumber()
  quantity: number;
  level: string;
  description: string;

  startDate: string;
  endDate: string;
  isActive: boolean;
}
