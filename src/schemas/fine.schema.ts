import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type FineDocument = Fine & Document

@Schema({
  timestamps: true,
  collection: "fines",
})
export class Fine {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: "Borrowing",
    required: true,
  })
  borrowingId: Types.ObjectId

  @Prop({
    required: true,
    min: 0,
  })
  amount: number

  @Prop({
    required: true,
    maxlength: 200,
  })
  reason: string

  @Prop({
    default: false,
  })
  paid: boolean

  @Prop({
    default: null,
  })
  paidDate: Date

  @Prop({
    enum: ["overdue", "lost", "damaged", "other"],
    required: true,
  })
  type: string

  @Prop({
    maxlength: 500,
  })
  notes: string
}

export const FineSchema = SchemaFactory.createForClass(Fine)

// Indexes
FineSchema.index({ userId: 1 })
FineSchema.index({ borrowingId: 1 })
FineSchema.index({ paid: 1 })
FineSchema.index({ type: 1 })
FineSchema.index({ createdAt: -1 })
FineSchema.index({ userId: 1, paid: 1 })
