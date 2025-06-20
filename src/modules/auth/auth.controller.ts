import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { AuthService } from "./auth.service"
import { type LoginDto, LoginResponseDto } from "./dto/login.dto"
import { type RegisterDto, RegisterResponseDto } from "./dto/regiter.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Đăng ký tài khoản mới" })
  @ApiResponse({
    status: 201,
    description: "Đăng ký thành công",
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Username hoặc email đã tồn tại",
  })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu không hợp lệ",
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto)
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Đăng nhập" })
  @ApiResponse({
    status: 200,
    description: "Đăng nhập thành công",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Thông tin đăng nhập không đúng",
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto)
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy thông tin profile của user hiện tại" })
  @ApiResponse({
    status: 200,
    description: "Thông tin profile",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập",
  })
  async getProfile(@Request() req) {
    const user = await this.authService.findUserById(req.user.sub)
    if (!user) {
      throw new Error("User không tồn tại")
    }

    const { password, ...profile } = user.toObject()
    return profile
  }

  @Post("refresh")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Token mới",
  })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.sub)
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Đăng xuất" })
  @ApiResponse({
    status: 200,
    description: "Đăng xuất thành công",
  })
  async logout() {
    // Với JWT, logout chỉ cần client xóa token
    // Có thể implement blacklist token nếu cần
    return {
      message: "Đăng xuất thành công",
    }
  }
}
