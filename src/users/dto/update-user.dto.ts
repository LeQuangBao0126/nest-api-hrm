import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'password',
]) {
  // ko mún cho cập nhật email và password , còn update password là chức năng riêng
  _id: string;
}
