interface User {
  userId: string;
  email: string;
  password?: string;
}

type UserAttribute = keyof User;

interface UserOptionsModel {
  where: Partial<User>;
  attributes: UserAttribute[] | { exclude: UserAttribute[] };
}

interface UserUpdateOptionsModel {
  where: Partial<User>;
}

interface UserRepository {
  create: (data: User) => Promise<User>;
  findOne: (options: UserOptionsModel) => Promise<User | null>;
  update: (
    data: Partial<User>,
    options: UserUpdateOptionsModel,
  ) => Promise<void>;
}
