import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { UserService } from "./user.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto, UpdateUserProfileDto } from "./dto/update-user.dto"
import { UserResponseDto } from "./dto/user-responsive.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/role.gruad"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin", "librarian")
  @ApiOperation({ summary: "Tạo user mới (Admin/Librarian only)" })
  @ApiResponse({
    status: 201,
    description: "User được tạo thành công",
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin", "librarian")
  @ApiOperation({ summary: "Lấy danh sách users" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "role", required: false, type: String })
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("role") role?: string,
  ) {
    return this.userService.findAll(page, limit, search, role)
  }

  @Get("profile")
  @ApiOperation({ summary: "Lấy thông tin profile của user hiện tại" })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.userService.findById(req.user.sub)
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("admin", "librarian")
  @ApiOperation({ summary: "Lấy thông tin user theo ID" })
  async findOne(@Param("id") id: string): Promise<UserResponseDto> {
    return this.userService.findById(id)
  }

  @Patch("profile")
  @ApiOperation({ summary: "Cập nhật profile của user hiện tại" })
  async updateProfile(@Request() req, @Body() updateUserProfileDto: UpdateUserProfileDto): Promise<UserResponseDto> {
    return this.userService.update(req.user.sub, updateUserProfileDto)
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles("admin", "librarian")
  @ApiOperation({ summary: "Cập nhật user (Admin/Librarian only)" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Xóa user (Admin only)" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.userService.delete(id)
  }
}
