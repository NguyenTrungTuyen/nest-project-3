import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import * as bcrypt from "bcrypt"
import type { UserDocument } from "../../schemas/user.schema"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { UserResponseDto } from "./dto/user-responsive.dto"
import { LIBRARY_CONSTANTS } from "../../constants/library.contsants"

@Injectable()
export class UserService {
  private userModel: Model<UserDocument>

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel
  }

  private transformUserToResponse(user: any): UserResponseDto {
    const userObj = user.toObject ? user.toObject() : user

    return new UserResponseDto({
      _id: (userObj._id as any).toString(),
      username: userObj.username,
      email: userObj.email,
      fullName: userObj.fullName,
      role: userObj.role,
      phone: userObj.phone,
      address: userObj.address,
      borrowedBooks:
        userObj.borrowedBooks?.map((book: any) => ({
          bookId: (book.bookId as any).toString(),
          borrowedDate: book.borrowedDate,
          dueDate: book.dueDate,
        })) || [],
      fines: userObj.fines,
      isActive: userObj.isActive,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    })
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Kiểm tra username và email đã tồn tại
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username: createUserDto.username }, { email: createUserDto.email }],
      })
      .exec()

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException("Tên đăng nhập đã tồn tại")
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException("Email đã tồn tại")
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      borrowedBooks: [],
      fines: 0,
      isActive: true,
    }

    const createdUser = new this.userModel(userData)
    const savedUser = await createdUser.save()

    return this.transformUserToResponse(savedUser)
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    role?: string,
  ): Promise<{
    users: UserResponseDto[]
    total: number
    totalPages: number
    currentPage: number
  }> {
    const skip = (page - 1) * limit
    const filter: any = {}

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (role) {
      filter.role = role
    }

    const [users, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ])

    return {
      users: users.map((user) => this.transformUserToResponse(user)),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID người dùng không hợp lệ")
    }

    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng")
    }

    return this.transformUserToResponse(user)
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec()
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec()
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID người dùng không hợp lệ")
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec()

    if (!updatedUser) {
      throw new NotFoundException("Không tìm thấy người dùng")
    }

    return this.transformUserToResponse(updatedUser)
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID người dùng không hợp lệ")
    }

    const result = await this.userModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Không tìm thấy người dùng")
    }
  }

  async addBorrowedBook(userId: string, bookId: string, dueDate: Date): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(bookId)) {
      throw new BadRequestException("ID không hợp lệ")
    }

    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: {
          borrowedBooks: {
            bookId: new Types.ObjectId(bookId),
            borrowedDate: new Date(),
            dueDate,
          },
        },
      })
      .exec()
  }

  async removeBorrowedBook(userId: string, bookId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(bookId)) {
      throw new BadRequestException("ID không hợp lệ")
    }

    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: {
          borrowedBooks: { bookId: new Types.ObjectId(bookId) },
        },
      })
      .exec()
  }

  async updateFines(userId: string, amount: number): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("ID người dùng không hợp lệ")
    }

    await this.userModel
      .findByIdAndUpdate(userId, {
        $inc: { fines: amount },
      })
      .exec()
  }

  async canBorrowMoreBooks(userId: string): Promise<boolean> {
    const user = await this.findById(userId)
    const maxBooks = LIBRARY_CONSTANTS.MAX_BOOKS_PER_USER[user.role] || 3
    return user.borrowedBooks.length < maxBooks
  }
}
