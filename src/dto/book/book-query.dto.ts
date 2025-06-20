import { IsOptional, IsString, IsNumber, IsMongoId, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class BookQueryDto {
  @ApiPropertyOptional({
    description: "Tìm kiếm theo tiêu đề, tác giả",
    example: "clean code",
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: "Lọc theo danh mục",
    example: "507f1f77bcf86cd799439011",
  })
  @IsOptional()
  @IsMongoId()
  category?: string

  @ApiPropertyOptional({
    description: "Lọc theo tác giả",
    example: "Robert C. Martin",
  })
  @IsOptional()
  @IsString()
  author?: string

  @ApiPropertyOptional({
    description: "Chỉ hiển thị sách có sẵn",
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  availableOnly?: boolean

  @ApiPropertyOptional({
    description: "Số trang",
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1

  @ApiPropertyOptional({
    description: "Số lượng mỗi trang",
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10

  @ApiPropertyOptional({
    description: "Sắp xếp theo",
    enum: ["title", "author", "publishYear", "createdAt", "borrowedCount"],
    default: "createdAt",
  })
  @IsOptional()
  @IsEnum(["title", "author", "publishYear", "createdAt", "borrowedCount"])
  sortBy?: string = "createdAt"

  @ApiPropertyOptional({
    description: "Thứ tự sắp xếp",
    enum: ["asc", "desc"],
    default: "desc",
  })
  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc"
}
