import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  isNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

class UpdatedBy {
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
class HistoryStas {
  @IsNotEmpty({ message: 'status khi cập nhật không được trống' })
  status: string;

  @IsNotEmpty({ message: 'apdated at khi cập nhật không được trống' })
  updatedAt: Date;

  @ValidateNested()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNotEmpty({ message: 'history không được để trống ' })
  @IsArray({ message: 'Phải là 1 mảng' })
  @ValidateNested()
  @Type(() => HistoryStas)
  history: HistoryStas[];
}
