import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
      location,
    } = createJobDto;
    let newJob = await this.jobModel.create({
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      description,
      location,
      startDate,
      endDate,
      isActive,
      createdBy: { _id: user._id, email: user.email },
    });

    return {
      _id: newJob._id,
      createdAt: newJob.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    console.log({ filter });
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      // @ts-ignore: Khong tới
      .sort(sort as any)
      .populate({ path: 'company' })
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    const rs = await this.jobModel.findOne({ _id: id, isDeleted: false });
    return rs;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return 'job not found ';
    }

    await this.jobModel.updateOne(
      {
        _id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    const rs = await this.jobModel.softDelete({
      _id,
    });
    return rs;
  }
}
