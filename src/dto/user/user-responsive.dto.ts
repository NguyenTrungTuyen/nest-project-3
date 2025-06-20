import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Expose, Type } from "class-transformer"

class BorrowedBookResponseDto {
  @ApiProperty()
  bookId: string

  @ApiProperty()
  borrowedDate: Date

  @ApiProperty()
  dueDate: Date
}

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  _id: string

  @ApiProperty()
  @Expose()
  username: string

  @ApiProperty()
  @Expose()
  email: string

  @ApiProperty()
  @Expose()
  fullName: string

  @ApiProperty()
  @Expose()
  role: string

  @ApiProperty()
  @Expose()
  phone: string

  @ApiProperty()
  @Expose()
  address: string

  @ApiProperty({ type: [BorrowedBookResponseDto] })
  @Expose()
  @Type(() => BorrowedBookResponseDto)
  borrowedBooks: BorrowedBookResponseDto[]

  @ApiProperty()
  @Expose()
  fines: number

  @ApiProperty()
  @Expose()
  isActive: boolean

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @Exclude()
  password: string

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial)
  }
}
