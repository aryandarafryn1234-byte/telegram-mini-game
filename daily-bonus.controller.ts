import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('bonus')
export class DailyBonusController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('daily')
  async claimDailyBonus(
    @Headers('x-telegram-id') telegramId: string,
  ) {
    if (!telegramId) {
      throw new UnauthorizedException(
        'Telegram ID is required',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        telegramId,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    const now = new Date();
    const bonus = 250;
    const xpReward = 25;

    if (user.lastDailyBonusAt) {
      const elapsed =
        now.getTime() -
        user.lastDailyBonusAt.getTime();

      const cooldown =
        24 * 60 * 60 * 1000;

      if (elapsed < cooldown) {
        const remaining =
          cooldown - elapsed;

        const hours = Math.floor(
          remaining /
            (60 * 60 * 1000),
        );

        const minutes = Math.floor(
          (remaining %
            (60 * 60 * 1000)) /
            (60 * 1000),
        );

        throw new BadRequestException(
          `Daily bonus is not ready. Try again in ${hours}h ${minutes}m`,
        );
      }
    }

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          const freshUser =
            await tx.user.findUnique({
              where: {
                id: user.id,
              },
            });

          if (!freshUser) {
            throw new UnauthorizedException(
              'User not found',
            );
          }

          if (
            freshUser.lastDailyBonusAt
          ) {
            const elapsed =
              now.getTime() -
              freshUser.lastDailyBonusAt.getTime();

            const cooldown =
              24 * 60 * 60 * 1000;

            if (elapsed < cooldown) {
              throw new BadRequestException(
                'Daily bonus is not ready',
              );
            }
          }

          const balanceBefore =
            freshUser.balance;

          const balanceAfter =
            balanceBefore + bonus;

          const updatedUser =
            await tx.user.update({
              where: {
                id: freshUser.id,
              },
              data: {
                balance: balanceAfter,
                xp: {
                  increment: xpReward,
                },
                lastDailyBonusAt: now,
              },
            });

          await tx.walletTransaction.create(
            {
              data: {
                userId: freshUser.id,
                amount: bonus,
                type: 'DAILY_BONUS',
                balanceBefore,
                balanceAfter,
                reference:
                  `daily_bonus_${freshUser.id}_${now.getTime()}`,
                metadata: {
                  source: 'daily_bonus',
                  xp: xpReward,
                },
                note:
                  'Daily virtual coins bonus',
              },
            },
          );

          return updatedUser;
        },
      );

    return {
      success: true,
      message:
        'Daily bonus claimed successfully',
      bonus,
      xp: xpReward,
      balance: result.balance,
      nextBonus:
        new Date(
          now.getTime() +
            24 * 60 * 60 * 1000,
        ),
    };
  }
        }
