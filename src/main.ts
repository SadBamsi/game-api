import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable global validation pipe so DTOs with class-validator decorators work
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields from body
      forbidNonWhitelisted: true, // Throw on unknown fields
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  await app.listen(3001);
  console.log(`🚀 Application running on http://localhost:3001`);
}
bootstrap();
