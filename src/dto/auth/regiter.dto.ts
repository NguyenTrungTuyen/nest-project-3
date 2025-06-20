import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty({
    description: "Tên đăng nhập",
    minLength: 3,
    maxLength: 50,
    example: "john_doe",
  })
  @IsString()
  @MinLength(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
  @MaxLength(50, { message: "Tên đăng nhập không được quá 50 ký tự" })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới" })
  username: string

  @ApiProperty({
    description: "Email",
    example: "john@example.com",
  })
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string

  @ApiProperty({
    description: "Mật khẩu",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  password: string

  @ApiProperty({
    description: "Họ và tên",
    maxLength: 100,
    example: "Nguyễn Văn A",
  })
  @IsString()
  @MaxLength(100, { message: "Họ tên không được quá 100 ký tự" })
  fullName: string

  @ApiProperty({
    description: "Số điện thoại",
    example: "0123456789",
  })
  @IsString()
  @Matches(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ (10-11 số)" })
  phone: string

  @ApiProperty({
    description: "Địa chỉ",
    maxLength: 200,
    example: "123 Đường ABC, Quận 1, TP.HCM",
  })
  @IsString()
  @MaxLength(200, { message: "Địa chỉ không được quá 200 ký tự" })
  address: string
}
