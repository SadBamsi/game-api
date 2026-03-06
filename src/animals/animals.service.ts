import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AnimalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.animal.findMany();
  }
}
