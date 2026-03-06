import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UpsertProgressDto } from "./dto/upsert-progress.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve the progress record for the given user.
   * Throws NotFoundException (404) if no progress row exists yet.
   */
  async getProgress(userId: number) {
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
      select: {
        levelStatus: true,
        currentStageIndex: true,
        languageMode: true,
      },
    });

    if (!progress) {
      throw new NotFoundException("No progress found for this user");
    }

    return progress;
  }

  /**
   * Create or update the progress record for the given user.
   * Safe to call regardless of whether a row already exists (upsert).
   */
  async upsertProgress(userId: number, dto: UpsertProgressDto) {
    await this.prisma.userProgress.upsert({
      where: { userId },
      create: {
        userId,
        levelStatus: dto.levelStatus as Prisma.InputJsonValue,
        currentStageIndex: dto.currentStageIndex,
        languageMode: dto.languageMode,
      },
      update: {
        levelStatus: dto.levelStatus as Prisma.InputJsonValue,
        currentStageIndex: dto.currentStageIndex,
        languageMode: dto.languageMode,
      },
    });

    return { ok: true };
  }
}
