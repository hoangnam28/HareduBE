import { DEFAULT_PLACEHODER, EXPIRES_IN, Roles, TokenType } from '@common/constants/global.const';
import MESSAGE from '@common/constants/message.const';
import { IToken, JwtPayload } from '@common/interfaces/auth.interface';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { Token } from '@models/token.model';
import { User } from '@models/user.model';
import { MailService } from '@modules/mail/mail.service';
import { TokensRepository } from '@modules/token/token.repository';
import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { LoginDto, RegisterDto, RenewTokenDto } from 'src/dto/auth.dto';
import { BaseApiException } from 'src/exceptions/base-api.exception';
import { v4 as uuidv4 } from 'uuid';
import { StudentRepository } from './student.repository';
import { TutorRepository } from './tutor.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userRepository: UsersRepository,
    private tokensRepository: TokensRepository,
    private readonly configService: ConfigService,
    private mailService: MailService,
    private tutorRepository: TutorRepository,
    private studentRepository: StudentRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  private secret = this.configService.get<string>('JWT_SECRET_KEY');

  async login({ password, email }: LoginDto) {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new BadRequestException(ItemNotFoundMessage('user'));
    if (!user.isActive) {
      throw new BaseApiException({ message: MESSAGE.USER.USER_NOT_ACTIVE });
    }

    if (!user.status) throw new BaseApiException({ message: MESSAGE.AUTH.NOT_VERIFY_MAIL });

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) throw new BaseApiException({ message: MESSAGE.AUTH.WRONG_PASSWORD });

    const { accessToken, refreshToken } = await this.generateUserToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: dummy, ...rest } = user.toObject();
    return {
      user: rest,
      accessToken,
      refreshToken,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(data: RegisterDto, request: any): Promise<User> {
    const name = data.email.split('@')[0];
    const newUser = await this.userRepository.create({
      ...data,
      avatar: DEFAULT_PLACEHODER.AVATAR,
      slug: data.email,
      name,
    });
    const { role } = data;
    if (role === Roles.TUTOR) {
      await this.tutorRepository.create({
        userId: newUser,
        identityCardFront: DEFAULT_PLACEHODER.IDENTITY_CARD_FRONT,
        identityCardBack: DEFAULT_PLACEHODER.IDENTITY_CARD_BACK,
      });
    } else if (role === Roles.STUDENT) {
      await this.studentRepository.create({ userId: newUser._id });
    }
    const token = await this.signVerifyToken({
      id: newUser._id,
      status: newUser.status,
    });
    await this.mailService.sendConfirmationEmailRegister(
      newUser.email,
      `${request.get('origin')}/auth/login?token=${token}`,
    );
    return newUser;
  }

  async generateUserToken(user: User, session?: ClientSession) {
    const sessionId = await this.genarateDeviceId();
    const accessTokenPayload: JwtPayload = {
      userId: user._id,
      tokenType: TokenType.ACCESS_TOKEN,
      sessionId,
      ...(user?.role != undefined && { role: user.role }),
    };
    const refreshTokenPayload: JwtPayload = {
      userId: user._id,
      tokenType: TokenType.REFRESH_TOKEN,
      sessionId,
      ...(user?.role && { role: user.role }),
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.signPayload(accessTokenPayload),
      this.signPayload(refreshTokenPayload),
    ]);
    await Promise.all([this.saveRefreshToken(refreshToken, session)]);
    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  async signPayload(payload: JwtPayload): Promise<IToken> {
    const { tokenType, sessionId } = payload;
    const expiresIn = tokenType === TokenType.ACCESS_TOKEN ? EXPIRES_IN.ACCESS_TOKEN : EXPIRES_IN.REFRESH_TOKEN;
    const token = this.jwt.sign({ ...payload }, { secret: this.secret, expiresIn: expiresIn / 1000 });
    return {
      token,
      userId: payload.userId,
      sessionId,
    };
  }

  async signVerifyToken(payload: any) {
    const token = this.jwt.sign({ ...payload }, { secret: this.secret, expiresIn: '2h' });
    return token;
  }

  async saveRefreshToken(refreshToken: IToken, session?: ClientSession): Promise<Token> {
    const { userId, sessionId } = refreshToken;
    return await this.tokensRepository.insertOrUpdate({ userId, sessionId }, { token: refreshToken.token }, session);
  }

  async genarateDeviceId(): Promise<string> {
    while (true) {
      const sessionId = uuidv4();
      const isExistsDeviceId = await this.tokensRepository.findOne({ sessionId });
      if (!isExistsDeviceId) return sessionId;
    }
  }

  async renewToken(renewTokenDto: RenewTokenDto) {
    const { refreshToken } = renewTokenDto;
    const foundToken = await this.tokensRepository.findOne({ token: refreshToken });
    if (!foundToken) {
      throw new BadRequestException('access-denied');
    }
    const foundUser = await this.userRepository.findOne({ _id: foundToken.userId });
    if (!foundUser) {
      throw new BadRequestException(ItemNotFoundMessage('user'));
    }
    const sessionId = foundToken.sessionId;
    const accessTokenPayload: JwtPayload = {
      userId: foundUser._id,
      tokenType: TokenType.ACCESS_TOKEN,
      sessionId,
      ...(foundUser?.role != undefined && { role: foundUser.role }),
    };
    const accessToken = await this.signPayload(accessTokenPayload);
    return accessToken.token;
  }

  async logout({ sessionId, userId }: IToken) {
    await this.tokensRepository.removeByFilter({ userId, sessionId });
    return true;
  }

  async confirm(token: string): Promise<boolean> {
    const { id, status } = this.jwt.verify(token, { secret: this.secret });

    if (status) {
      throw new BadRequestException('access-denied');
    }

    const crUser = await this.userRepository.findById(id);
    if (!crUser) {
      throw new BadRequestException(ItemNotFoundMessage('user'));
    }
    if (crUser.status) {
      throw new BadRequestException('user-activated');
    }
    await this.userRepository.update(crUser.id, { status: true });

    return true;
  }
}
