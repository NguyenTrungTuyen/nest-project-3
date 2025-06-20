import { ApiProperty } from "@nestjs/swagger"

export class RegisterResponseDto {
  @ApiProperty({
    description: "Thông báo kết quả",
    example: "Đăng ký thành công",
  })
  message: string

  @ApiProperty({
    description: "Thông tin user vừa tạo",
  })
  user: {
    id: string
    username: string
    email: string
    fullName: string
    role: string
  }

  @ApiProperty({
    description: "Access token (tùy chọn - có thể tự động đăng nhập sau khi đăng ký)",
    required: false,
  })
  access_token?: string
}
