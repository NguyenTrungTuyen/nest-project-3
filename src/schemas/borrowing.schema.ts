import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BorrowingDocument = Borrowing & Document

@Schema({
  timestamps: true,
  collection: "borrowings",
})
export class Borrowing {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: "Book",
    required: true,
  })
  bookId: Types.ObjectId

  @Prop({
    required: true,
  })
  borrowedDate: Date

  @Prop({
    required: true,
  })
  dueDate: Date

  @Prop({
    default: null,
  })
  returnedDate: Date

  @Prop({
    required: true,
    enum: ["borrowed", "returned", "overdue", "lost"],
    default: "borrowed",
  })
  status: string

  @Prop({
    default: 0,
    min: 0,
  })
  fine: number

  @Prop({
    maxlength: 500,
  })
  notes: string

  // Virtual field để kiểm tra có quá hạn không
  get isOverdue(): boolean {
    if (this.status === "returned") return false
    return new Date() > this.dueDate
  }

  // Virtual field để tính số ngày quá hạn
  get overdueDays(): number {
    if (!this.isOverdue) return 0
    const today = new Date()
    const diffTime = today.getTime() - this.dueDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export const BorrowingSchema = SchemaFactory.createForClass(Borrowing)

// Indexes
BorrowingSchema.index({ userId: 1 })
BorrowingSchema.index({ bookId: 1 })
BorrowingSchema.index({ status: 1 })
BorrowingSchema.index({ dueDate: 1 })
BorrowingSchema.index({ borrowedDate: 1 })
BorrowingSchema.index({ userId: 1, status: 1 })

// Compound index cho tìm kiếm phức tạp
BorrowingSchema.index({ userId: 1, bookId: 1, borrowedDate: -1 })
