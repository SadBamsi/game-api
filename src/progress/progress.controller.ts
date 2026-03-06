import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { ProgressService } from "./progress.service";
import { UpsertProgressDto } from "./dto/upsert-progress.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("progress")
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * GET /progress
   * Returns the user's saved progress.
   * Responds with 200 + { levelStatus, currentStageIndex, languageMode }
   * or 404 if the user has no progress record yet.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getProgress(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.progressService.getProgress(user.id);
  }

  /**
   * PUT /progress
   * Creates or overwrites the user's progress record (upsert).
   * Responds with 200 { ok: true } on success.
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  upsertProgress(@Req() req: Request, @Body() dto: UpsertProgressDto) {
    const user = req.user as { id: number };
    return this.progressService.upsertProgress(user.id, dto);
  }
}
