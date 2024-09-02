import { Users as UserRepo } from "../schemas/index.js";

export class UserModel implements UserRepository {
  async findOne(options: UserOptionsModel) {
    const user = await UserRepo.findOne({
      where: options.where,
      attributes: options.attributes,
      raw: true,
    });

    return user as User | null;
  }
}
