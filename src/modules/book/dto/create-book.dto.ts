import { IsString, IsNumber, IsMongoId, Min, Max, MaxLength, Matches, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class CreateBookDto {
  @ApiProperty({
    description: "Tiêu đề sách",
    maxLength: 200,
    example: "Clean Code",
  })
  @IsString()
  @MaxLength(200)
  title: string

  @ApiProperty({
    description: "Tác giả",
    maxLength: 100,
    example: "Robert C. Martin",
  })
  @IsString()
  @MaxLength(100)
  author: string

  @ApiProperty({
    description: "Mã ISBN",
    example: "9780132350884",
  })
  @IsString()
  @Matches(/^[0-9]{10,13}$/, { message: "ISBN không hợp lệ" })
  isbn: string

  @ApiProperty({
    description: "ID danh mục",
    example: "507f1f77bcf86cd799439011",
  })
  @IsMongoId()
  category: string

  @ApiProperty({
    description: "Nhà xuất bản",
    maxLength: 100,
    example: "Prentice Hall",
  })
  @IsString()
  @MaxLength(100)
  publisher: string

  @ApiProperty({
    description: "Năm xuất bản",
    minimum: 1000,
    maximum: new Date().getFullYear(),
    example: 2008,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(new Date().getFullYear())
  publishYear: number

  @ApiProperty({
    description: "Số lượng sách",
    minimum: 0,
    example: 5,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  quantity: number

  @ApiProperty({
    description: "Vị trí trong thư viện",
    maxLength: 50,
    example: "Kệ A1",
  })
  @IsString()
  @MaxLength(50)
  location: string

  @ApiPropertyOptional({
    description: "Mô tả sách",
    maxLength: 1000,
    example: "Sách về lập trình sạch...",
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @ApiPropertyOptional({
    description: "Ảnh bìa sách",
    example: "/images/clean-code.jpg",
  })
  @IsOptional()
  @IsString()
  coverImage?: string
}
