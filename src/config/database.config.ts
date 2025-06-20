import type { ConfigService } from "@nestjs/config"
import type { MongooseModuleOptions } from "@nestjs/mongoose"

export const getDatabaseConfig = (configService: ConfigService): MongooseModuleOptions => ({
  uri: configService.get<string>("DATABASE_URL") || configService.get<string>("MONGODB_URI"),
})
