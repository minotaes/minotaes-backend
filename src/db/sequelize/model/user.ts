import { Users as UserRepo } from "../schemas/index.js";
import { sequelizeErrorHandler } from "../utils/error-handler.js";

export class UserModel implements UserRepository {
  async create(options: User) {
    return await sequelizeErrorHandler(async () => {
      const user = await UserRepo.create(options);
      return user as User;
    });
  }

  async findOne(options: UserOptionsModel) {
    const user = await UserRepo.findOne({
      where: options.where,
      attributes: options.attributes,
      raw: true,
    });

    return user as User | null;
  }

  async update(data: Partial<User>, options: UserUpdateOptionsModel) {
    await UserRepo.update(data, options);
  }
}
