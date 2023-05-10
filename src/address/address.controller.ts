import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AddressService } from './address.service';

@UseGuards(JwtGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getAdresses(@GetUser('id') userId: number) {
    return this.addressService.getAdresses(userId);
  }
}
