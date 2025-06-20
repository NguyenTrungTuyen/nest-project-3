import type { ConfigService } from "@nestjs/config"
import type { JwtModuleOptions } from "@nestjs/jwt"

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>("JWT_SECRET"),
  signOptions: {
    expiresIn: configService.get<string>("JWT_EXPIRES_IN") || "24h",
  },
})
