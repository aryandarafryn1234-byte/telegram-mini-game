import { Controller, Get, Headers } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async me(@Headers('x-telegram-id') telegramId: string) {
    if (!telegramId) {
      return { error: 'Telegram ID is required' };
    }

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      select: {
        id: true,
        telegramId: true,
        username: true,
        firstName: true,
        balance: true,
        xp: true,
        referralCode: true,
      },
    });

    return user ?? { error: 'User not found' };
  }
}
