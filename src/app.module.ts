import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ProductModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
