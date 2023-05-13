import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { AccessGuard } from '../auth/guard';
import { EditUserDto } from './dto';

@UseGuards(AccessGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@GetUser() user: User): User {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(userId, dto);
  }
}
