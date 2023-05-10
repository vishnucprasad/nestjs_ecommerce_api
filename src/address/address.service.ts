import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddAddressDto } from './dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdresses(userId: number) {
    return await this.prisma.address.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async addAddress(userId: number, dto: AddAddressDto) {
    return await this.prisma.address.create({
      data: {
        userId,
        ...dto,
      },
    });
  }
}
