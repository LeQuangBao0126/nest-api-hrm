import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import mongoose from 'mongoose';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { TransformInterceptor } from 'src/core/transform.interceptor';

@Controller({
  path: 'companies',
  version: ['1', '2'],
})
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    //const objId = new mongoose.Types.ObjectId('a');
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete company')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  // by pass jwt check token
  @Get()
  @Public()
  @ResponseMessage('Fetch list companies')
  // @UseInterceptors(TransformInterceptor<any>)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
    /// return {meta  , data , message , statusCode }
  }
}
