import { IsMongoId, IsOptional, IsDateString, IsString, MaxLength } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BorrowBookDto {
  @ApiProperty({
    description: "ID của sách cần mượn",
    example: "507f1f77bcf86cd799439011",
  })
  @IsMongoId()
  bookId: string

  @ApiPropertyOptional({
    description: "Ngày hẹn trả (nếu không có sẽ tự động tính)",
    example: "2024-07-01",
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string

  @ApiPropertyOptional({
    description: "Ghi chú",
    maxLength: 500,
    example: "Cần sách để nghiên cứu",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string
}
