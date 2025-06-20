import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum, Matches } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { LIBRARY_CONSTANTS } from "../../constants/library.contsants"

export class CreateUserDto {
  @ApiProperty({
    description: "Tên đăng nhập",
    minLength: 3,
    maxLength: 50,
    example: "john_doe",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string

  @ApiProperty({
    description: "Mật khẩu",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({
    description: "Email",
    example: "john@example.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "Họ và tên",
    maxLength: 100,
    example: "Nguyễn Văn A",
  })
  @IsString()
  @MaxLength(100)
  fullName: string

  @ApiPropertyOptional({
    description: "Vai trò",
    enum: Object.values(LIBRARY_CONSTANTS.USER_ROLES),
    default: LIBRARY_CONSTANTS.USER_ROLES.MEMBER,
  })
  @IsOptional()
  @IsEnum(Object.values(LIBRARY_CONSTANTS.USER_ROLES))
  role?: string = LIBRARY_CONSTANTS.USER_ROLES.MEMBER

  @ApiProperty({
    description: "Số điện thoại",
    example: "0123456789",
  })
  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" })
  phone: string

  @ApiProperty({
    description: "Địa chỉ",
    maxLength: 200,
    example: "123 Đường ABC, Quận 1, TP.HCM",
  })
  @IsString()
  @MaxLength(200)
  address: string
}
