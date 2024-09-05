import { BadRequestException, Injectable } from '@nestjs/common';
import { ClassroomRepository } from './classroom.repository';
import { Pagination } from '@common/interfaces/filter.interface';
import { CreateClassroomDto } from 'src/dto/classroom.dto';
import { UsersRepository } from '@modules/user/user.repository';
import { Roles, TransactionReason, TransactionStatus } from '@common/constants/global.const';
import { Connection, Types } from 'mongoose';
import { SlotRepository } from '@modules/slot/slot.repository';
import { TransactionService } from '@modules/transaction/transaction.service';
import { randomBytes } from 'crypto';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ClassroomService {
  constructor(
    private classroomRepository: ClassroomRepository,
    private usersRepository: UsersRepository,
    private slotRepository: SlotRepository,
    private transactionService: TransactionService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getMyClasses(userId: string, pagination: Pagination) {
    const user = await this.usersRepository.findById(userId);
    const isLeture = user?.role === Roles.TUTOR ? true : false;
    const { teachFileds } = pagination;
    const [data, total] = await this.classroomRepository.paginate({
      pagination: {
        ...pagination,
        ...(isLeture && { lecture: userId }),
        ...(!isLeture && { students: userId }),
        ...(teachFileds && { teachFileds }),
      },
      populates: [
        { path: 'lecture', select: '-password' },
        { path: 'students', select: '-password' },
        'banner',
        'thumbnail',
        'teachFileds',
      ],
      searchBy: ['name'],
      select: '-wallet',
    });

    return { data, total };
  }

  async getClasses(pagination: Pagination) {
    const { teachFileds, from } = pagination;
    const [data, total] = await this.classroomRepository.paginate({
      pagination: {
        ...pagination,
        ...(teachFileds && { teachFileds }),
        ...(from && { endTime: { $gte: from } }),
      },
      populates: [
        { path: 'lecture', select: '-password' },
        { path: 'students', select: '-password' },
        'banner',
        'thumbnail',
        'teachFileds',
      ],
      searchBy: ['name'],
      select: '-wallet',
    });

    return { data, total };
  }

  async findClassById(id: string) {
    const classroom = await this.classroomRepository.findById(id, [
      { path: 'lecture', select: '-password' },
      { path: 'students', select: '-password' },
      'banner',
      'thumbnail',
      'teachFileds',
    ]);
    return classroom;
  }

  async createClass(userId: string, data: CreateClassroomDto) {
    const newClass = await this.classroomRepository.create({ ...data, lecture: userId });
    return newClass;
  }

  async joinClass(userId: string, clasId: string) {
    const classroom = await this.classroomRepository.findById(clasId);
    if (!classroom) {
      throw new BadRequestException('Class not exist!');
    }

    if (classroom.startTime > new Date() || classroom.endTime < new Date()) {
      throw new BadRequestException('Action is not available!');
    }

    const user = await this.usersRepository.findById(userId);

    const users = classroom.students;
    const userIndex = users.indexOf(user._id);
    let wallet = 0;

    if (userIndex !== -1) {
      wallet = -classroom.price;
      users.splice(userIndex, 1);
      await user.updateOne({ money: user.money + classroom.price });
      await this.transactionService.createTransaction({
        userId: user._id,
        changeBalance: classroom.price,
        changeState: true,
        afterBalance: (user.money ?? 0) + classroom.price,
        reason: TransactionReason.LEAVE_CLASS,
        token: randomBytes(16).toString('hex'),
        status: TransactionStatus.SUCCESS,
      });
    } else {
      wallet = classroom.price;
      users.push(new Types.ObjectId(userId));
      if (user.money < classroom.price) {
        throw new BadRequestException('Not enough money!');
      }
      await this.transactionService.createTransaction({
        userId: user._id,
        changeBalance: classroom.price * -1,
        changeState: true,
        afterBalance: (user.money ?? 0) - classroom.price,
        reason: TransactionReason.JOIN_CLASSS,
        token: randomBytes(16).toString('hex'),
        status: TransactionStatus.SUCCESS,
      });
      await user.updateOne({ money: user.money - classroom.price });
    }

    await classroom.updateOne({ students: users, wallet: (classroom.wallet ?? 0) + wallet });
    return {};
  }

  async getAllSlots(userId: string, pagination: Pagination) {
    const { timeStart, timeEnd } = pagination;
    console.log('🚀 ~ ClassroomService ~ getAllSlots ~ timeStart:', timeStart);

    const classIds = await this.classroomRepository.distinct('_id', { lecture: userId });
    console.log('🚀 ~ ClassroomService ~ getAllSlots ~ classIds:', classIds);
    const test = await this.slotRepository.findAll(
      {
        classroomId: { $in: classIds },
        startTime: { $gte: timeStart },
      },
      ['classroomId'],
    );
    console.log('🚀 ~ ClassroomService ~ getAllSlots ~ test:', test);

    return test;
  }

  async getAllMySlot(userId: string, pagination: Pagination) {
    const user = await this.usersRepository.findById(userId);
    const isLeture = user?.role === Roles.TUTOR ? true : false;
    const { timeStart, timeEnd } = pagination;
    const [data, total] = await this.classroomRepository.paginate({
      pagination: {
        ...pagination,
        ...(isLeture && { lecture: userId }),
        ...(!isLeture && { students: userId }),
      },
    });
    const test = await this.slotRepository.findAll(
      {
        classroomId: { $in: data.map((cl) => cl._id) },
        startTime: { $gte: timeStart },
        endTime: { $lte: timeEnd },
      },
      ['classroomId'],
    );

    return test;
  }

  async deleteClass(id: string) {
    return await this.classroomRepository.remove(id);
  }

  async withDrawMoney(userId: string, classroomId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    if (user.role !== Roles.TUTOR) {
      throw new BadRequestException('Action is not available!');
    }
    const classroom = await this.classroomRepository.findById(classroomId);
    if (!classroom) {
      throw new BadRequestException('Class not found!');
    }
    if (classroom.lecture.toString() !== userId) {
      throw new BadRequestException('Action is not available!');
    }
    if (!classroom.wallet) {
      throw new BadRequestException('No money to withdraw!');
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await user.updateOne({ money: Number((user.money ?? 0) + classroom.wallet) });
      await classroom.updateOne({ wallet: 0 });
      await this.transactionService.createTransaction({
        userId: user._id,
        changeBalance: classroom.wallet,
        changeState: true,
        afterBalance: (user.money ?? 0) + classroom.wallet,
        reason: TransactionReason.WITHDRAW,
        token: randomBytes(16).toString('hex'),
        status: TransactionStatus.SUCCESS,
      });
      await session.commitTransaction();
      return { money: classroom.wallet };
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }
}
