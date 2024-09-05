import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { GetPagination } from '@common/decorators/pagination-request';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { Pagination } from '@common/interfaces/filter.interface';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { User } from '@models/user.model';
import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { UpdateUserDTO, UserQueryDto, WithDrawDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ResponseType } from '@common/constants/global.const';

const imageFileFilter = (req: any, file: any, callback: (error: Error, acceptFile: boolean) => void) => {
  const allowedExtensions = ['.png', '.jpg', '.gif', '.jpeg', '.webp'];
  const ext = extname(file.originalname).toLowerCase();
  callback(null, allowedExtensions.includes(ext));
};

const pdfFileFilter = (req: any, file: any, callback: (error: Error, acceptFile: boolean) => void) => {
  const allowedExtensions = ['.pdf'];
  const ext = extname(file.originalname).toLowerCase();
  callback(null, allowedExtensions.includes(ext));
};

const multerOptionsImage: MulterOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 52428800, //20MB
  },
};

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getOwnUser(@Profile() { userId }: JwtTokenDecrypted) {
    return this.userService.getOwnUser(userId);
  }

  @Get('get-me')
  @ApiPaginationResponse(User)
  getMe(@Profile() { userId }: JwtTokenDecrypted) {
    return this.userService.getMe(userId);
  }

  @Get('get-tutor/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiPaginationResponse(User)
  getTutor(@Param('id') userId: string) {
    return this.userService.getTutor(userId);
  }

  @Get('tutor-need-verify')
  getTutorNeedVerify() {
    return this.userService.getTutorNeedVerify();
  }

  @Get(':slug')
  getOneUser(@Param('slug') slug: string) {
    return this.userService.getOneUser(slug);
  }

  @Post('uploadCV')
  @UseInterceptors(
    FilesInterceptor('file', Number.POSITIVE_INFINITY, {
      fileFilter: pdfFileFilter,
      limits: {
        fileSize: 52428800, //20MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  updateCv(@Profile() { userId }: JwtTokenDecrypted, @UploadedFiles() cv: Array<Express.Multer.File>) {
    return this.userService.uploadCV(userId, cv[0]);
  }

  @Post('uploadAvatar')
  @UseInterceptors(FilesInterceptor('file', Number.POSITIVE_INFINITY, multerOptionsImage))
  @ApiConsumes('multipart/form-data')
  uploadAvatar(@Profile() { userId }: JwtTokenDecrypted, @UploadedFiles() avatar: Array<Express.Multer.File>) {
    return this.userService.uploadAvatar(userId, avatar[0]);
  }

  @Post('upload-cccd/:type')
  @UseInterceptors(FilesInterceptor('file', Number.POSITIVE_INFINITY, multerOptionsImage))
  @ApiConsumes('multipart/form-data')
  uploadCCCD(
    @Profile() { userId }: JwtTokenDecrypted,
    @Param('type') type: string,
    @UploadedFiles() cccd: Array<Express.Multer.File>,
  ) {
    console.log(type);

    return this.userService.uploadCCCD(userId, cccd[0], type);
  }

  @Patch('update')
  update(@Profile() { userId }: JwtTokenDecrypted, @Body() user: UpdateUserDTO) {
    return this.userService.update(userId, user);
  }

  @Get('wallet/get-balance')
  getBalance(@Profile() { userId }: JwtTokenDecrypted) {
    return this.userService.getBalance(userId);
  }

  @Post('wallet/update-bank')
  updateBank(@Profile() { userId }: JwtTokenDecrypted, @Body() user: any) {
    return this.userService.updateBank(userId, user);
  }

  @Get('wallet/transaction-history')
  getTransactionHistory(@Profile() { userId }: JwtTokenDecrypted) {
    return this.userService.getTransactionHistory(userId);
  }

  @Patch('change-password')
  changePassword(@Profile() { userId }: JwtTokenDecrypted, @Body() data: any) {
    return this.userService.changePassword(userId, data);
  }

  @Post('with-draw-money')
  @ApiBody({ type: WithDrawDto })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  withDrawMoney(@Profile() user: JwtTokenDecrypted, @Body() data: WithDrawDto) {
    return this.userService.withDrawMoneyFromBalance(user.userId, data);
  }

  @Patch('update-tutor-need-verify')
  updateTutorNeedVerify(@Body() data: any) {
    return this.userService.updateTutorNeedVerify(data);
  }
}
