import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type NotificationDocument = Notification & Document

@Schema({
  timestamps: true,
  collection: "notifications",
})
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: Types.ObjectId

  @Prop({
    required: true,
    maxlength: 100,
  })
  title: string

  @Prop({
    required: true,
    maxlength: 500,
  })
  message: string

  @Prop({
    default: false,
  })
  isRead: boolean

  @Prop({
    enum: ["reminder", "overdue", "fine", "system", "info"],
    required: true,
    default: "info",
  })
  type: string

  @Prop({
    enum: ["low", "medium", "high"],
    default: "medium",
  })
  priority: string

  // Reference đến đối tượng liên quan (nếu có)
  @Prop({
    type: Types.ObjectId,
    refPath: "relatedModel",
  })
  relatedId: Types.ObjectId

  @Prop({
    enum: ["Book", "Borrowing", "Fine"],
    required: function () {
      return this.relatedId != null
    },
  })
  relatedModel: string

  @Prop({
    default: null,
  })
  readAt: Date

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

// Indexes
NotificationSchema.index({ userId: 1 })
NotificationSchema.index({ isRead: 1 })
NotificationSchema.index({ type: 1 })
NotificationSchema.index({ priority: 1 })
NotificationSchema.index({ createdAt: -1 })
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })

// Middleware để tự động set readAt khi isRead = true
NotificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date()
  }
  next()
})
