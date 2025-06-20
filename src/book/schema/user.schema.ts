import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type UserDocument = User & Document

// Embedded schema cho sách đang mượn
@Schema({ _id: false })
export class BorrowedBook {
  @Prop({ type: Types.ObjectId, ref: "Book", required: true })
  bookId: Types.ObjectId

  @Prop({ required: true })
  borrowedDate: Date

  @Prop({ required: true })
  dueDate: Date
}

const BorrowedBookSchema = SchemaFactory.createForClass(BorrowedBook)

@Schema({
  timestamps: true,
  collection: "users",
})
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  username: string

  @Prop({
    required: true,
    minlength: 6,
  })
  password: string

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  fullName: string

  @Prop({
    required: true,
    enum: ["member", "librarian", "admin"],
    default: "member",
  })
  role: string

  @Prop({
    required: true,
    match: /^[0-9]{10,11}$/,
  })
  phone: string

  @Prop({
    required: true,
    maxlength: 200,
  })
  address: string

  @Prop({
    type: [BorrowedBookSchema],
    default: [],
  })
  borrowedBooks: BorrowedBook[]

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  fines: number

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indexes
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ fullName: "text", username: "text", email: "text" })
