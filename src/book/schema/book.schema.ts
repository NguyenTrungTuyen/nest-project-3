import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BookDocument = Book & Document

@Schema({
  timestamps: true,
  collection: "books",
})
export class Book {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  title: string

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  author: string

  @Prop({
    required: true,
    unique: true,
    match: /^[0-9]{10,13}$/,
  })
  isbn: string

  @Prop({
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  })
  category: Types.ObjectId

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  publisher: string

  @Prop({
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
  })
  publishYear: number

  @Prop({
    required: true,
    min: 0,
  })
  quantity: number

  @Prop({
    required: true,
    min: 0,
  })
  available: number

  @Prop({
    default: 0,
    min: 0,
  })
  borrowedCount: number

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  location: string

  @Prop({
    maxlength: 1000,
  })
  description: string

  @Prop({
    default: "/images/default-book.jpg",
  })
  coverImage: string

  @Prop({
    default: true,
  })
  isActive: boolean

  // Virtual field để tính số sách đang được mượn
  get borrowedQuantity(): number {
    return this.quantity - this.available
  }
}

export const BookSchema = SchemaFactory.createForClass(Book)

// Indexes
BookSchema.index({ title: 1 })
BookSchema.index({ author: 1 })
BookSchema.index({ isbn: 1 })
BookSchema.index({ category: 1 })
BookSchema.index({ available: 1 })
BookSchema.index({ title: "text", author: "text", description: "text" })

// Middleware để đảm bảo available không vượt quá quantity
BookSchema.pre("save", function (next) {
  if (this.available > this.quantity) {
    this.available = this.quantity
  }
  next()
})
