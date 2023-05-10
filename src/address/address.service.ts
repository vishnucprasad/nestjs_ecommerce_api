import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
