import { IsOptional, IsString, MaxLength, IsEnum, IsNumber, Min } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class ReturnBookDto {
  @ApiPropertyOptional({
    description: "Ghi chú khi trả sách",
    maxLength: 500,
    example: "Sách còn nguyên vẹn",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @ApiPropertyOptional({
    description: "Tình trạng sách khi trả",
    enum: ["good", "damaged", "lost"],
    default: "good",
  })
  @IsOptional()
  @IsEnum(["good", "damaged", "lost"])
  condition?: string = "good"

  @ApiPropertyOptional({
    description: "Tiền phạt bổ sung (nếu có)",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalFine?: number = 0
}
