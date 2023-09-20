import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'email không được rỗng' })
  email: string;

  @IsNotEmpty({ message: 'userid không được rỗng' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'url không được rỗng' })
  url: string;
  @IsNotEmpty({ message: 'status không được rỗng' })
  status: string;
  @IsNotEmpty({ message: 'company id không được rỗng' })
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'job id không được rỗng' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'url không được rỗng' })
  url: string;

  @IsNotEmpty({ message: 'company id không được rỗng' })
  @IsMongoId({ message: 'company id phải là mongodb id ' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'job id không được rỗng' })
  @IsMongoId({ message: 'job id phải là mongodb id ' })
  jobId: mongoose.Schema.Types.ObjectId;
}
