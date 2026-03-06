import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response, Request } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 1000, // 1 hour
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user and set an httpOnly JWT cookie.
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(registerDto);
    const { access_token } = await this.authService.login(user);

    response.cookie("Authentication", access_token, COOKIE_OPTIONS);

    return {
      message: "Registration successful",
      user,
    };
  }

  /**
   * POST /auth/login
   * Validate credentials and set an httpOnly JWT cookie.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);
    const { access_token } = await this.authService.login(user);

    response.cookie("Authentication", access_token, COOKIE_OPTIONS);

    return {
      message: "Login successful",
      user,
    };
  }

  /**
   * POST /auth/logout
   * Clear the authentication cookie.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("Authentication");
    return { message: "Logged out successfully" };
  }

  /**
   * GET /auth/me
   * Protected route — returns all info about the authenticated user based on the HTTP-only cookie.
   */
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req: Request) {
    return req.user;
  }
}
