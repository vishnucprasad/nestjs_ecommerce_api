import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AddressService } from './address.service';
import { AddAddressDto, EditAddressDto } from './dto';
import { Address } from '@prisma/client';

@UseGuards(AccessGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getAdresses(@GetUser('id') userId: number): Promise<Address[]> {
    return this.addressService.getAdresses(userId);
  }

  @Get(':id')
  getAddressById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) addressId: number,
  ): Promise<Address> {
    return this.addressService.getAddressById(userId, addressId);
  }

  @Post()
  addAddress(
    @GetUser('id') userId: number,
    @Body() dto: AddAddressDto,
  ): Promise<Address> {
    return this.addressService.addAddress(userId, dto);
  }

  @Patch(':id')
  editAddressById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) addressId: number,
    @Body() dto: EditAddressDto,
  ): Promise<Address> {
    return this.addressService.editAddressById(userId, addressId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAddressById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) addressId: number,
  ): Promise<Address> {
    return this.addressService.deleteAddressById(userId, addressId);
  }
}
