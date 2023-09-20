import { Injectable } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createResumeDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto;
    const { _id, email } = user;

    const resumeObj = {
      url,
      companyId,
      jobId,
      email,
      userId: _id,
      status: 'PENDING',
      createdBy: { _id, email },
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id,
            email,
          },
        },
      ],
    };

    const newCv = await this.resumeModel.create(resumeObj);

    return newCv;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    delete filter.population;

    // console.log({ filter });
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      // @ts-ignore: Khong tới
      .sort(sort as any)
      .populate(population)
      .populate([{ path: 'jobId', select: { _id: 1, name: 1 } }])
      // @ts-ignore: Khong tới
      .select(projection)
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

  findOne(id: string) {
    return this.resumeModel.findOne({ _id: id });
  }

  findByUser(user: IUser) {
    return this.resumeModel.findOne({ userId: user._id });
  }

  async update(id: string, status: string, user: IUser) {
    const updated = await this.resumeModel.updateOne(
      {
        _id: id,
      },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found user`;
    }
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeModel.softDelete({ _id: id });
  }
}
