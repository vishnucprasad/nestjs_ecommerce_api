import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { RefreshGuard } from './guard/refresh-token.guard';
import { AccessGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  @Post('/refresh')
  refreshToken(@Body() dto: RefreshTokenDto, @GetUser() user: User) {
    return this.authService.refreshToken(dto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  @Delete('/signout')
  signout(@GetUser('id') userId: number) {
    return;
  }
}
