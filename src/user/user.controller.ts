import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@GetUser() user: User) {
    return user;
  }
}
