import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AnimalsModule } from "./animals/animals.module";
import { ProgressModule } from "./progress/progress.module";

@Module({
  imports: [AuthModule, AnimalsModule, ProgressModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
