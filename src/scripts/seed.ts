import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { AuthService } from "../modules/auth/auth.service"
import { LIBRARY_CONSTANTS } from "../constants/library.contsants"

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const authService = app.get(AuthService)

  try {
    // Tạo admin user
    const adminData = {
      username: "admin",
      password: "admin123",
      email: "admin@library.com",
      fullName: "Administrator",
      phone: "0123456789",
      address: "Library HQ",
      role: LIBRARY_CONSTANTS.USER_ROLES.ADMIN,
    }

    // Tạo librarian user
    const librarianData = {
      username: "librarian",
      password: "librarian123",
      email: "librarian@library.com",
      fullName: "Thủ thư",
      phone: "0987654321",
      address: "Library Branch",
      role: LIBRARY_CONSTANTS.USER_ROLES.LIBRARIAN,
    }

    // Tạo member user
    const memberData = {
      username: "member",
      password: "member123",
      email: "member@library.com",
      fullName: "Thành viên",
      phone: "0111222333",
      address: "Member Address",
    }

    console.log("🌱 Seeding database...")

    await authService.register(adminData)
    console.log("✅ Admin user created")

    await authService.register(librarianData)
    console.log("✅ Librarian user created")

    await authService.register(memberData)
    console.log("✅ Member user created")

    console.log("🎉 Database seeded successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error.message)
  } finally {
    await app.close()
  }
}

seed()
