import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { User } from '@models/user.model';
import {
  DEFAULT_PLACEHODER,
  Roles,
  SEARCH_BY,
  TransactionReason,
  TransactionStatus,
} from '@common/constants/global.const';
import { TutorRepository } from './tutor.repository';
import * as fs from 'fs';
import * as path from 'path';
import { Tutor } from '@models/tutor.model';
import { Student } from '@models/student.model';
import sharp from 'sharp';
import { UpdateUserDTO, WithDrawDto } from 'src/dto/user.dto';
import { TransactionHistoryRepository } from './transaction-history.repository';
import { BaseApiException } from 'src/exceptions/base-api.exception';
import MESSAGE from '@common/constants/message.const';
import { randomBytes } from 'crypto';
import { TransactionService } from '@modules/transaction/transaction.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private tutorRepository: TutorRepository,
    private transactionHistoryRepository: TransactionHistoryRepository,
    private transactionService: TransactionService,
  ) {}

  generateFilename = (file: Express.Multer.File) => {
    file.originalname = file.originalname.replace(/(\.png|\.jpg|\.jpeg)$/, '.webp');
    const filename = `${Date.now()}-${file.originalname.replace(/[%# ]/g, '')}`;
    return filename;
  };

  async getOwnUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    let detailInfo: Tutor | Student;
    if (user.role === Roles.TUTOR)
      detailInfo = await this.tutorRepository.findOne({ userId: user._id }, ['teachingFiledsId']);
    if (user.role === Roles.STUDENT) detailInfo = await this.tutorRepository.findOne({ userId: user._id });

    if (!user) {
      throw new BadRequestException('Access denied!');
    }

    return { ...user['_doc'], detailInfo };
  }

  async getOneUser(slug: string) {
    const user = await this.userRepository.findOne({ slug: slug });
    let detailInfo: Tutor | Student;
    if (user.role === Roles.TUTOR)
      detailInfo = await this.tutorRepository.findOne({ userId: user._id }, ['teachingFiledsId']);
    if (user.role === Roles.STUDENT) detailInfo = await this.tutorRepository.findOne({ userId: user._id });

    if (!user) {
      throw new BadRequestException('Access denied!');
    }

    return { ...user['_doc'], detailInfo };
  }

  async uploadCV(userId: string, cv: Express.Multer.File) {
    const tutor = await this.tutorRepository.findOne({ userId });
    if (tutor?.curriculumVitaePath) fs.unlink(path.join('./public/', tutor?.curriculumVitaePath), () => {});
    const fileName = this.generateFilename(cv);
    const uploadPath = './public/cv/upload/';
    await fs.promises.writeFile(path.join(uploadPath, fileName), cv.buffer);
    const curriculumVitaePath = `cv/upload/${fileName}`;
    return await this.tutorRepository.updateByFilter({ userId }, { curriculumVitaePath });
  }

  async uploadAvatar(userId: string, avatar: Express.Multer.File) {
    const user = await this.userRepository.findOne({ _id: userId });
    if (user?.avatar && user?.avatar !== DEFAULT_PLACEHODER.AVATAR)
      fs.unlink(path.join('./public/', user?.avatar), () => {});
    const fileName = this.generateFilename(avatar);
    const uploadPath = './public/avatar/upload/';
    await fs.promises.writeFile(path.join(uploadPath, fileName), avatar.buffer);
    const avatarPath = `avatar/upload/${fileName}`;

    const tutor = await this.tutorRepository.findOne({ userId });
    const needVerify = tutor
      ? tutor.identityCardFront !== DEFAULT_PLACEHODER.IDENTITY_CARD_FRONT &&
        tutor.identityCardBack !== DEFAULT_PLACEHODER.IDENTITY_CARD_BACK
      : false;
    return await this.userRepository.updateByFilter({ _id: userId }, { avatar: avatarPath, needVerify });
  }

  async uploadCCCD(userId: string, cccd: Express.Multer.File, type) {
    const tutor = await this.tutorRepository.findOne({ userId });
    const user = await this.userRepository.findOne({ _id: userId });
    if (type === 'f' && tutor?.identityCardFront && tutor?.identityCardFront !== DEFAULT_PLACEHODER.IDENTITY_CARD_FRONT)
      fs.unlink(path.join('./public/', tutor?.identityCardFront), () => {});
    if (type === 'b' && tutor?.identityCardBack && tutor?.identityCardBack !== DEFAULT_PLACEHODER.IDENTITY_CARD_BACK)
      fs.unlink(path.join('./public/', tutor?.identityCardBack), () => {});
    const fileName = this.generateFilename(cccd);
    const uploadPath = './public/cccd/upload/';
    await fs.promises.writeFile(path.join(uploadPath, fileName), cccd.buffer);
    const cccdPath = `cccd/upload/${fileName}`;
    if (type === 'f') {
      const needVerify =
        tutor.identityCardBack !== DEFAULT_PLACEHODER.IDENTITY_CARD_BACK && user.avatar !== DEFAULT_PLACEHODER.AVATAR;
      await this.userRepository.updateByFilter({ _id: userId }, { needVerify });
      return await this.tutorRepository.updateByFilter({ userId: userId }, { identityCardFront: cccdPath });
    } else {
      const needVerify =
        tutor.identityCardFront !== DEFAULT_PLACEHODER.IDENTITY_CARD_FRONT && user.avatar !== DEFAULT_PLACEHODER.AVATAR;
      console.log(tutor);
      console.log(user);

      await this.userRepository.updateByFilter({ _id: userId }, { needVerify });
      return await this.tutorRepository.updateByFilter({ userId: userId }, { identityCardBack: cccdPath });
    }
  }

  async update(userId: string, user: UpdateUserDTO) {
    return await this.userRepository.update(userId, user);
  }

  async getBalance(userId: string) {
    const rs = await this.transactionHistoryRepository.findOne({ userId });
    const balance = !!rs ? rs.afterBalance : 0;
    const tutor = await this.tutorRepository.findOne({ userId });
    return {
      balance,
      bank: tutor?.bank,
    };
  }

  async updateBank(userId: string, user: any) {
    return await this.tutorRepository.updateByFilter({ userId }, { bank: user.bank });
  }

  async getTransactionHistory(userId: string) {
    return await this.transactionHistoryRepository.findAll({ userId });
  }

  async changePassword(userId: string, data: any) {
    const { oldPassword, newPassword } = data;
    const user = await this.userRepository.findById(userId);
    const isMatch = await user.isValidPassword(oldPassword);
    if (!isMatch) throw new BaseApiException({ message: MESSAGE.AUTH.WRONG_PASSWORD });
    if (oldPassword === newPassword)
      throw new BaseApiException({ message: 'New password must difference recent password' });
    return await this.userRepository.update(userId, { password: newPassword });
  }

  async getMe(userId: string) {
    return await this.userRepository.findById(userId);
  }

  async withDrawMoneyFromBalance(userId: string, { money, password }: WithDrawDto) {
    const user = await this.userRepository.findById(userId);
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) throw new BaseApiException({ message: MESSAGE.AUTH.WRONG_PASSWORD });
    if (user.money < money) throw new BaseApiException({ message: 'Balance is not enough' });
    await user.updateOne({ money: user.money });
    await this.transactionService.createTransaction({
      userId: user._id,
      changeBalance: money * -1,
      changeState: true,
      afterBalance: user.money,
      reason: TransactionReason.WITHDRAW_PROFILE,
      token: randomBytes(16).toString('hex'),
      status: TransactionStatus.PENDING,
    });
    return { money: money };
  }

  async getTutorNeedVerify() {
    return (await this.tutorRepository.findAll({}, ['userId'])).filter((item: any) => item?.userId?.needVerify);
  }

  async updateTutorNeedVerify(data: any) {
    return await this.userRepository.update(data.userId, {
      needVerify: data.needVerify,
      isVerified: data.isVerified,
      reasonNotVerified: data.reasonNotVerified,
    });
  }

  async getTutor(userId: string) {
    const tutor = await this.tutorRepository.findOne({ userId: userId });
    if (!tutor) throw new BaseApiException({ message: 'Tutor not found' });
    return tutor;
  }
}
