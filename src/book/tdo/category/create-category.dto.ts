import { IsString, MaxLength, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateCategoryDto {
  @ApiProperty({
    description: "Tên danh mục",
    maxLength: 100,
    example: "Lập trình",
  })
  @IsString()
  @MaxLength(100)
  name: string

  @ApiPropertyOptional({
    description: "Mô tả danh mục",
    maxLength: 500,
    example: "Sách về lập trình máy tính",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiProperty({
    description: "Slug cho URL",
    maxLength: 100,
    example: "lap-trinh",
  })
  @IsString()
  @MaxLength(100)
  slug: string
}
