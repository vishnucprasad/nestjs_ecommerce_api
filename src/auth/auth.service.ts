import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async signup(
    dto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      const accessToken = await this.signAccessToken(user.id);
      const refreshToken = await this.signRefreshToken(user.id);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError ||
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }

      throw error;
    }
  }

  async signin(
    dto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const accessToken = await this.signAccessToken(user.id);
    const refreshToken = await this.signRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(
    dto: RefreshTokenDto,
    user: User,
  ): Promise<{
    access_token: string;
  }> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: dto.refreshToken,
      },
    });

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.signAccessToken(user.id);

    return {
      access_token: accessToken,
    };
  }

  async signout(userId: number) {
    return await this.prisma.refreshToken.delete({
      where: {
        userId,
      },
    });
  }

  async signAccessToken(userId: number): Promise<string> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('ACCESS_TOKEN_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret,
    });

    return token;
  }

  async signRefreshToken(userId: number): Promise<string> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('REFRESH_TOKEN_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60d',
      secret,
    });

    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        userId,
      },
    });

    if (refreshToken) {
      await this.prisma.refreshToken.delete({
        where: {
          id: refreshToken.id,
        },
      });
    }

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
      },
    });

    return token;
  }
}
