import { IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({
    description: "Tên đăng nhập hoặc email",
    example: "john_doe",
  })
  @IsString()
  username: string

  @ApiProperty({
    description: "Mật khẩu",
    minLength: 6,
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string

  @ApiProperty()
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
  }
}
