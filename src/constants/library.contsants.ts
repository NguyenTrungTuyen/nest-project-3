// Các hằng số cho hệ thống thư viện
export const LIBRARY_CONSTANTS = {
  // Thời gian mượn sách (ngày)
  DEFAULT_BORROW_DAYS: 14,
  MAX_BORROW_DAYS: 30,

  // Số sách tối đa có thể mượn
  MAX_BOOKS_PER_USER: {
    member: 3,
    librarian: 10,
    admin: 20,
  },

  // Tiền phạt (VND)
  FINE_PER_DAY: 5000, // 5k/ngày trễ hạn
  FINE_LOST_BOOK_MULTIPLIER: 2, // Gấp 2 lần giá sách
  FINE_DAMAGED_BOOK: 50000, // 50k cho sách hỏng

  // Trạng thái
  BORROWING_STATUS: {
    BORROWED: "borrowed",
    RETURNED: "returned",
    OVERDUE: "overdue",
    LOST: "lost",
  },

  USER_ROLES: {
    MEMBER: "member",
    LIBRARIAN: "librarian",
    ADMIN: "admin",
  },

  NOTIFICATION_TYPES: {
    REMINDER: "reminder",
    OVERDUE: "overdue",
    FINE: "fine",
    SYSTEM: "system",
    INFO: "info",
  },

  FINE_TYPES: {
    OVERDUE: "overdue",
    LOST: "lost",
    DAMAGED: "damaged",
    OTHER: "other",
  },

  // Cấu hình hệ thống
  SYSTEM_CONFIG: {
    MAX_RENEWAL_TIMES: 2, // Số lần gia hạn tối đa
    OVERDUE_GRACE_DAYS: 3, // Số ngày ân hạn
    NOTIFICATION_BEFORE_DUE: 3, // Thông báo trước hạn trả (ngày)
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 50,
    MIN_USERNAME_LENGTH: 3,
    MAX_FULLNAME_LENGTH: 100,
    MAX_ADDRESS_LENGTH: 200,
    MAX_NOTES_LENGTH: 200, 
},

}