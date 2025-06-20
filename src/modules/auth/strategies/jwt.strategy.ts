import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import type { Model } from "mongoose"
import type { ConfigService } from "@nestjs/config"
import type { UserDocument } from "../../../schemas/user.schema"
import { Strategy, ExtractJwt } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userModel: Model<UserDocument>

  constructor(
    private configService: ConfigService,
    userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "fallback-secret",
    })
    this.userModel = userModel
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec()
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User không tồn tại hoặc đã bị vô hiệu hóa")
    }

    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      email: payload.email,
    }
  }
}
