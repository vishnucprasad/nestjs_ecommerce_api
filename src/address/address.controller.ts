import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AddressService } from './address.service';
import { AddAddressDto } from './dto';
import { Address } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getAdresses(@GetUser('id') userId: number): Promise<Address[]> {
    return this.addressService.getAdresses(userId);
  }

  @Post()
  addAddress(
    @GetUser('id') userId: number,
    @Body() dto: AddAddressDto,
  ): Promise<Address> {
    return this.addressService.addAddress(userId, dto);
  }
}
