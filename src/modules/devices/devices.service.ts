import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice } from './entities/user-device.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(UserDevice)
    private readonly deviceRepository: Repository<UserDevice>,
  ) {}

  async register(userId: string, dto: RegisterDeviceDto) {
    // Find existing device
    const existing = await this.deviceRepository.findOne({
      where: { deviceId: dto.deviceId },
    });

    if (existing) {
      // Update existing device
      return this.deviceRepository.save({
        ...existing,
        userId,
        expoPushToken: dto.expoPushToken,
        platform: dto.platform,
        appVersion: dto.appVersion,
        isActive: true,
        lastSeenAt: new Date(),
      });
    }

    // Create new device
    return this.deviceRepository.save(
      this.deviceRepository.create({
        userId,
        deviceId: dto.deviceId,
        expoPushToken: dto.expoPushToken,
        platform: dto.platform,
        appVersion: dto.appVersion,
        isActive: true,
        lastSeenAt: new Date(),
      })
    );
  }

  async getActiveDevicesByUser(userId: string): Promise<UserDevice[]> {
    return this.deviceRepository.find({
      where: { userId, isActive: true },
    });
  }

  async disableDevice(deviceId: string) {
    await this.deviceRepository.update(
      { deviceId },
      { isActive: false }
    );
  }
}
