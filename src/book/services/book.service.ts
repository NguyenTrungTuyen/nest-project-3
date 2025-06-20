import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import type { BookDocument } from "../schemas/book.schema"
import type { CreateBookDto } from "../dto/book/create-book.dto"
import type { UpdateBookDto } from "../dto/book/update-book.dto"
import type { BookQueryDto } from "../dto/book/book-query.dto"

@Injectable()
export class BookService {
  constructor(private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    // Kiểm tra ISBN đã tồn tại
    const existingBook = await this.bookModel.findOne({ isbn: createBookDto.isbn }).exec()
    if (existingBook) {
      throw new ConflictException("ISBN đã tồn tại")
    }

    const bookData = {
      ...createBookDto,
      available: createBookDto.quantity, // Ban đầu available = quantity
    }

    const createdBook = new this.bookModel(bookData)
    return await createdBook.save()
  }

  async findAll(queryDto: BookQueryDto): Promise<{
    books: BookDocument[]
    total: number
    totalPages: number
    currentPage: number
  }> {
    const {
      search,
      category,
      author,
      availableOnly,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryDto

    const skip = (page - 1) * limit
    const filter: any = { isActive: true }

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    // Filter by category
    if (category && Types.ObjectId.isValid(category)) {
      filter.category = new Types.ObjectId(category)
    }

    // Filter by author
    if (author) {
      filter.author = { $regex: author, $options: "i" }
    }

    // Only available books
    if (availableOnly) {
      filter.available = { $gt: 0 }
    }

    // Sort
    const sort: any = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const [books, total] = await Promise.all([
      this.bookModel.find(filter).populate("category", "name slug").sort(sort).skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments(filter).exec(),
    ])

    return {
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }
  }

  async findById(id: string): Promise<BookDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID sách không hợp lệ")
    }

    const book = await this.bookModel.findById(id).populate("category", "name slug description").exec()

    if (!book) {
      throw new NotFoundException("Không tìm thấy sách")
    }

    return book
  }

  async findByIsbn(isbn: string): Promise<BookDocument> {
    return await this.bookModel.findOne({ isbn }).exec()
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID sách không hợp lệ")
    }

    // Nếu cập nhật quantity, cần cập nhật available tương ứng
    if (updateBookDto.quantity !== undefined) {
      const currentBook = await this.findById(id)
      const borrowedQuantity = currentBook.quantity - currentBook.available

      if (updateBookDto.quantity < borrowedQuantity) {
        throw new BadRequestException(`Không thể giảm số lượng xuống dưới ${borrowedQuantity} (số sách đang được mượn)`)
      }

      updateBookDto.available = updateBookDto.quantity - borrowedQuantity
    }

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .populate("category", "name slug description")
      .exec()

    if (!updatedBook) {
      throw new NotFoundException("Không tìm thấy sách")
    }

    return updatedBook
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID sách không hợp lệ")
    }

    const book = await this.findById(id)

    // Kiểm tra có sách đang được mượn không
    if (book.available < book.quantity) {
      throw new BadRequestException("Không thể xóa sách đang được mượn")
    }

    const result = await this.bookModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Không tìm thấy sách")
    }
  }

  async updateAvailability(bookId: string, change: number): Promise<void> {
    if (!Types.ObjectId.isValid(bookId)) {
      throw new BadRequestException("ID sách không hợp lệ")
    }

    const book = await this.bookModel.findById(bookId).exec()
    if (!book) {
      throw new NotFoundException("Không tìm thấy sách")
    }

    const newAvailable = book.available + change

    if (newAvailable < 0) {
      throw new BadRequestException("Không đủ sách để mượn")
    }

    if (newAvailable > book.quantity) {
      throw new BadRequestException("Số sách có sẵn không thể vượt quá tổng số lượng")
    }

    await this.bookModel
      .findByIdAndUpdate(bookId, {
        available: newAvailable,
        $inc: { borrowedCount: -change }, // Tăng borrowedCount khi giảm available
      })
      .exec()
  }

  async getPopularBooks(limit = 10): Promise<BookDocument[]> {
    return await this.bookModel
      .find({ isActive: true })
      .sort({ borrowedCount: -1 })
      .limit(limit)
      .populate("category", "name slug")
      .exec()
  }

  async getBooksByCategory(categoryId: string, limit = 10): Promise<BookDocument[]> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException("ID danh mục không hợp lệ")
    }

    return await this.bookModel
      .find({ category: new Types.ObjectId(categoryId), isActive: true })
      .limit(limit)
      .populate("category", "name slug")
      .exec()
  }

  async searchBooks(query: string, limit = 20): Promise<BookDocument[]> {
    return await this.bookModel
      .find({
        $text: { $search: query },
        isActive: true,
      })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .populate("category", "name slug")
      .exec()
  }

  async getBookStats(): Promise<{
    totalBooks: number
    availableBooks: number
    borrowedBooks: number
    categoriesCount: number
  }> {
    const [totalBooks, availableBooks, categoriesCount] = await Promise.all([
      this.bookModel.countDocuments({ isActive: true }).exec(),
      this.bookModel.countDocuments({ isActive: true, available: { $gt: 0 } }).exec(),
      this.bookModel.distinct("category").exec(),
    ])

    const borrowedBooks = await this.bookModel
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $subtract: ["$quantity", "$available"] } } } },
      ])
      .exec()

    return {
      totalBooks,
      availableBooks,
      borrowedBooks: borrowedBooks[0]?.total || 0,
      categoriesCount: categoriesCount.length,
    }
  }
}
