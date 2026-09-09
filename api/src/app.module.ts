import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersController } from './users.controller';
import { GamesController } from './games.controller';
import { DailyBonusController } from './daily-bonus.controller';

@Module({
  controllers: [
    UsersController,
    GamesController,
    DailyBonusController,
  ],
  providers: [
    PrismaService,
  ],
  exports: [
    PrismaService,
  ],
})
export class AppModule {}
