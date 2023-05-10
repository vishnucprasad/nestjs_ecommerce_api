import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddAddressDto, EditAddressDto } from './dto';

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

  async getAddressById(userId: number, addressId: number) {
    return await this.prisma.address.findFirst({
      where: {
        userId: userId,
        id: addressId,
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

  async editAddressById(
    userId: number,
    addressId: number,
    dto: EditAddressDto,
  ) {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address || address.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return await this.prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        ...dto,
      },
    });
  }
}
