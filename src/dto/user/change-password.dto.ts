import { IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ChangePasswordDto {
  @ApiProperty({
    description: "Mật khẩu hiện tại",
    example: "oldpassword123",
  })
  @IsString()
  currentPassword: string

  @ApiProperty({
    description: "Mật khẩu mới",
    minLength: 6,
    example: "newpassword123",
  })
  @IsString()
  @MinLength(6)
  newPassword: string
}
