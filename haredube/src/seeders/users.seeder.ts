import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { DEFAULT_PASSWORD, Roles } from '@common/constants/global.const';
import 'dotenv/config';

const users = [
  {
    role: Roles.ADMIN,
    email: `${process.env.MASTER_ACCOUNT}`,
    name: process.env.MASTER_ACCOUNT,
    password: DEFAULT_PASSWORD,
    phone: process.env.MASTER_PHONE,
    status: true,
    isActive: true,
  },
  {
    role: Roles.STAFF,
    email: `${process.env.STAFF_ACCOUNT}`,
    name: process.env.STAFF_ACCOUNT,
    password: DEFAULT_PASSWORD,
    phone: process.env.STAFF_PHONE,
    status: true,
    isActive: true,
  },
  {
    role: Roles.STUDENT,
    email: `${process.env.STUDENT_ACCOUNT}`,
    name: process.env.STUDENT_ACCOUNT,
    password: DEFAULT_PASSWORD,
    phone: process.env.STUDENT_PHONE,
    status: true,
    isActive: true,
  },
  {
    role: Roles.TUTOR,
    email: `${process.env.LECTURE_ACCOUNT}`,
    name: process.env.LECTURE_ACCOUNT,
    password: DEFAULT_PASSWORD,
    phone: process.env.LECTURE_PHONE,
    status: true,
    isActive: true,
  },
];

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    const admin = await this.user.find({ email: users[0].email });

    if (admin.length > 0) {
      return this.user.updateOne({ _id: admin[0]._id }, users[0]);
    } else {
      return this.user.create(users);
    }
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({
      email: { $in: users.map((user) => user.email) },
    });
  }
}
