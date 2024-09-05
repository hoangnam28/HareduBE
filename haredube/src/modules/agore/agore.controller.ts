import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgoreService } from './agore.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators/common.decorator';
import { SetUidDto } from 'src/dto/slot.dto';

@Controller('agore')
@ApiTags('agore')
export class AgoreController {
  constructor(private readonly agoreService: AgoreService) {}

  @Get('token/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  getToken(@Param('id') id: string) {
    return this.agoreService.generateToken(id);
  }

  @Post('uid/:id')
  @Public()
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({ type: SetUidDto })
  setUid(@Param('id') id: string, @Body() uidDto: SetUidDto) {
    return this.agoreService.setUid(id, uidDto.uid);
  }
}
