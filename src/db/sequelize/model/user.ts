import { Users } from "../schemas/index.js";

export class UserModel {
  static async getByEmail(options: { email: string }) {
    const user = await Users.findOne({ where: { email: options.email } });

    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  }

  static async getById(options: { userId: number }) {
    const user = await Users.findByPk(options.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  }

  static async create(options: { email: string; password: string }) {
    const user = await Users.create(options);

    return user.toJSON();
  }
}
