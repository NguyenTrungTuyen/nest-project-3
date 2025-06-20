import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { Model } from "mongoose"
import * as bcrypt from "bcrypt"
import type { UserDocument } from "../../schemas/user.schema"
import type { LoginDto, LoginResponseDto } from "./dto/login.dto"
import type { RegisterDto, RegisterResponseDto } from "./dto/regiter.dto"
import { LIBRARY_CONSTANTS } from "../../constants/library.contsants"

@Injectable()
export class AuthService {
  private userModel: Model<UserDocument>
  private jwtService: JwtService

  constructor(userModel: Model<UserDocument>, jwtService: JwtService) {
    this.userModel = userModel
    this.jwtService = jwtService
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      // Kiểm tra username và email đã tồn tại
      const existingUser = await this.userModel
        .findOne({
          $or: [{ username: registerDto.username }, { email: registerDto.email }],
        })
        .exec()

      if (existingUser) {
        if (existingUser.username === registerDto.username) {
          throw new ConflictException("Tên đăng nhập đã tồn tại")
        }
        if (existingUser.email === registerDto.email) {
          throw new ConflictException("Email đã tồn tại")
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10)

      // Tạo user mới với role mặc định là member
      const userData = {
        ...registerDto,
        password: hashedPassword,
        role: LIBRARY_CONSTANTS.USER_ROLES.MEMBER, // Force role = member cho đăng ký công khai
        borrowedBooks: [],
        fines: 0,
        isActive: true,
      }

      const createdUser = new this.userModel(userData)
      const savedUser = await createdUser.save()

      // Tạo JWT token (tùy chọn - có thể tự động đăng nhập sau khi đăng ký)
      const payload = {
        sub: savedUser._id.toString(),
        username: savedUser.username,
        role: savedUser.role,
      }
      const access_token = this.jwtService.sign(payload)

      return {
        message: "Đăng ký thành công",
        user: {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
          fullName: savedUser.fullName,
          role: savedUser.role,
        },
        access_token, // Tự động đăng nhập
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException("Đăng ký thất bại: " + error.message)
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Tìm user theo username hoặc email
    const user = await this.userModel
      .findOne({
        $or: [{ username: loginDto.username }, { email: loginDto.username }],
      })
      .exec()

    if (!user) {
      throw new UnauthorizedException("Thông tin đăng nhập không đúng")
    }

    // Kiểm tra account có active không
    if (!user.isActive) {
      throw new UnauthorizedException("Tài khoản đã bị vô hiệu hóa")
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Thông tin đăng nhập không đúng")
    }

    // Tạo JWT token
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
      email: user.email,
    }

    const access_token = this.jwtService.sign(payload)

    return {
      access_token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel
      .findOne({
        $or: [{ username }, { email: username }],
      })
      .exec()

    if (user && user.isActive && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async findUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec()
  }

  async findUserByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }).exec()
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec()
  }

  // Utility method để verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new UnauthorizedException("Token không hợp lệ")
    }
  }

  // Method để refresh token (nếu cần)
  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.userModel.findById(userId).exec()
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User không tồn tại hoặc đã bị vô hiệu hóa")
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
      email: user.email,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
