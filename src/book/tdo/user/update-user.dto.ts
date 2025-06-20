import { PartialType, OmitType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./create-user.dto"

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ["username", "password"] as const)) {}

export class UpdateUserProfileDto extends PartialType(
  OmitType(CreateUserDto, ["username", "password", "role"] as const),
) {}
