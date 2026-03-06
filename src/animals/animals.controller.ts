import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { AnimalsService } from "./animals.service";

@Controller("animals")
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * GET /animals
   * Returns the full list of animals with their Supabase Storage image URLs.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.animalsService.findAll();
  }
}
