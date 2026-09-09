import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Body,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GameType, TransactionType } from '@prisma/client';
import { randomInt } from 'crypto';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

class PlayGameDto {
  @IsEnum(GameType)
  game!: GameType;

  @IsInt()
  @Min(10)
  @Max(100000)
  bet!: number;
}

@Controller('games')
export class GamesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('play')
  async play(
    @Headers('x-telegram-id') telegramId: string,
    @Body() body: PlayGameDto,
  ) {
    if (!telegramId) {
      throw new BadRequestException('Telegram ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!Number.isInteger(body.bet) || body.bet < 10) {
      throw new BadRequestException('Minimum bet is 10 virtual coins');
    }

    if (body.bet > 100000) {
      throw new BadRequestException('Maximum bet is 100000 virtual coins');
    }

    if (user.balance < body.bet) {
      throw new BadRequestException('Insufficient virtual coins');
    }

    const result = this.generateResult(body.game, body.bet);

    const netChange = result.payout - body.bet;

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      // برداشت شرط فقط در صورتی انجام می‌شود
      // که موجودی کاربر هنوز کافی باشد.
      const debit = await tx.user.updateMany({
        where: {
          id: user.id,
          balance: {
            gte: body.bet,
          },
        },
        data: {
          balance: {
            decrement: body.bet,
          },
        },
      });

      if (debit.count !== 1) {
        throw new BadRequestException('Insufficient virtual coins');
      }

      if (result.payout > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            balance: {
              increment: result.payout,
            },
            xp: {
              increment: Math.max(1, Math.floor(body.bet / 10)),
            },
          },
        });
      } else {
        await tx.user.update({
          where: { id: user.id },
          data: {
            xp: {
              increment: Math.max(1, Math.floor(body.bet / 20)),
            },
          },
        });
      }

      await tx.gameSession.create({
        data: {
          userId: user.id,
          game: body.game,
          bet: body.bet,
          result: result.label,
          payout: result.payout,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          amount: -body.bet,
          type: TransactionType.GAME_LOSS,
          note: `${body.game} bet`,
        },
      });

      if (result.payout > 0) {
        await tx.walletTransaction.create({
          data: {
            userId: user.id,
            amount: result.payout,
            type: TransactionType.GAME_WIN,
            note: `${body.game} payout`,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          balance: true,
          xp: true,
        },
      });
    });

    return {
      success: true,
      game: body.game,
      bet: body.bet,
      result: result.label,
      payout: result.payout,
      net: netChange,
      balance: updatedUser?.balance ?? 0,
      xp: updatedUser?.xp ?? 0,
    };
  }

  private generateResult(
    game: GameType,
    bet: number,
  ): {
    label: string;
    payout: number;
  } {
    switch (game) {
      case GameType.SLOTS:
        return this.playSlots(bet);

      case GameType.DICE:
        return this.playDice(bet);

      case GameType.WHEEL:
        return this.playWheel(bet);

      default:
        throw new BadRequestException('Unsupported game');
    }
  }

  private playSlots(bet: number) {
    const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣'];

    const a = symbols[randomInt(symbols.length)];
    const b = symbols[randomInt(symbols.length)];
    const c = symbols[randomInt(symbols.length)];

    let multiplier = 0;

    if (a === b && b === c) {
      if (a === '7️⃣') {
        multiplier = 10;
      } else if (a === '💎') {
        multiplier = 7;
      } else {
        multiplier = 5;
      }
    } else if (a === b || b === c || a === c) {
      multiplier = 2;
    }

    return {
      label: `${a} ${b} ${c}`,
      payout: bet * multiplier,
    };
  }

  private playDice(bet: number) {
    const dice = randomInt(1, 7);

    let multiplier = 0;

    if (dice === 6) {
      multiplier = 5;
    } else if (dice >= 4) {
      multiplier = 2;
    }

    return {
      label: `🎲 ${dice}`,
      payout: bet * multiplier,
    };
  }

  private playWheel(bet: number) {
    const wheel = [
      { label: '💀 0x', multiplier: 0 },
      { label: '🪙 1.5x', multiplier: 1.5 },
      { label: '🔥 2x', multiplier: 2 },
      { label: '💎 3x', multiplier: 3 },
      { label: '⭐ 5x', multiplier: 5 },
      { label: '👑 10x', multiplier: 10 },
    ];

    const selected = wheel[randomInt(wheel.length)];

    return {
      label: selected.label,
      payout: Math.floor(bet * selected.multiplier),
    };
  }
                                                       }
