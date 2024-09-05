import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckoutRequestType } from '@payos/node/lib/type';
import { ConfigService } from '@nestjs/config';
const PayOS = require('@payos/node');
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@modules/user/user.repository';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { TransactionService } from '@modules/transaction/transaction.service';
import { TransactionReason, TransactionStatus } from '@common/constants/global.const';

@Injectable()
export class PayosService {
  private payOS: typeof PayOS;
  constructor(
    private readonly configService: ConfigService,
    private jwt: JwtService,
    private userRepository: UsersRepository,
    private tranService: TransactionService,
  ) {
    this.payOS = new PayOS(
      this.configService.get('PAYOS_CLIENT_ID'),
      this.configService.get('PAYOS_API_KEY'),
      this.configService.get('PAYOS_CHECKSUM_KEY'),
    );
  }
  private secret = this.configService.get<string>('JWT_SECRET_KEY');

  async createPayment(userId: string, amount: number, request: any) {
    const token = await this.signVerifyToken({
      amount: amount,
      userId,
    });
    const body: CheckoutRequestType = {
      amount,
      orderCode: Number(String(Date.now()).slice(-6)),
      description: 'Nap tien vao he thong',
      returnUrl: `${request.get('origin')}/users/wallet?token=${token}`,
      cancelUrl: `${request.get('origin')}/users/wallet?failed=true`,
    };
    try {
      const paymentLinkResponse = await this.payOS.createPaymentLink(body);
      return { paymentLink: paymentLinkResponse.checkoutUrl, amount: amount };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signVerifyToken(payload: any) {
    const token = this.jwt.sign({ ...payload }, { secret: this.secret, expiresIn: '2h' });
    return token;
  }

  async confirm(token: string) {
    const { userId, amount } = this.jwt.verify(token, { secret: this.secret });
    const isExist = await this.tranService.getTransByToken(userId, token);

    if (isExist) {
      throw new BadRequestException('access-denied');
    }

    const crUser = await this.userRepository.findById(userId);
    if (!crUser) {
      throw new BadRequestException(ItemNotFoundMessage('user'));
    }

    await this.userRepository.update(userId, { money: (crUser.money ?? 0) + amount });
    await this.tranService.createTransaction({
      userId: crUser._id,
      changeBalance: amount,
      changeState: true,
      afterBalance: (crUser.money ?? 0) + amount,
      reason: TransactionReason.DEPOSIT,
      token: token,
      status: TransactionStatus.SUCCESS,
    });

    return true;
  }
}
