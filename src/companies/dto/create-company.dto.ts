import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Không được để trống name' })
  name: string;

  @IsNotEmpty({ message: 'Không được để trống address' })
  address: string;

  @IsNotEmpty({ message: 'Không không được để trống description' })
  description: string;

  @IsNotEmpty({ message: 'Logo không được để trống' })
  logo: string;
}
