import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type CategoryDocument = Category & Document

@Schema({
  timestamps: true,
  collection: "categories",
})
export class Category {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  })
  name: string

  @Prop({
    maxlength: 500,
  })
  description: string

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category)

// Indexes
CategorySchema.index({ name: 1 })
CategorySchema.index({ slug: 1 })
CategorySchema.index({ name: "text", description: "text" })
