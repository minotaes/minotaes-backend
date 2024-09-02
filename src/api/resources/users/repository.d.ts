interface User {
  userId: string;
  email: string;
  password: string;
}

type UserAttribute = keyof User;

interface UserOptionsModel {
  where: Partial<User>;
  attributes: UserAttribute[] | { exclude: UserAttribute[] };
}

interface UserRepository {
  findOne: (options: UserOptionsModel) => Promise<User | null>;
}
