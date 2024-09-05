import { SlotRepository } from '@modules/slot/slot.repository';
import { Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';

@Injectable()
export class AgoreService {
  private readonly appId: string = '1976c314743540d6b9bd37a30daef8eb';
  private readonly appCertificate: string = 'b6b9c46a3cb347c9bfa96e5bce33f058';
  constructor(private slotRepository: SlotRepository) {}
  async generateToken(channelName: string) {
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    const token = await RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      0,
      role,
      privilegeExpireTime,
    );
    await this.slotRepository.update(channelName, { meetingId: token });
    return token;
  }

  async setUid(slotId: string, uid: string) {
    await this.slotRepository.update(slotId, { uid });
    return {};
  }
}
