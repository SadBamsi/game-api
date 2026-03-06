import { IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export enum LanguageMode {
  en = "en",
  by = "by",
}

export class UpsertProgressDto {
  /**
   * Arbitrary JSON object describing the completion status of each level.
   * Example: { "animals": true, "colors": false }
   */
  @IsNotEmpty()
  levelStatus: Record<string, unknown>;

  /** Zero-based index of the stage the user is currently on. */
  @IsInt()
  @Min(0)
  @Type(() => Number)
  currentStageIndex: number;

  /** Language the user has chosen for the game. */
  @IsEnum(LanguageMode)
  languageMode: LanguageMode;
}
