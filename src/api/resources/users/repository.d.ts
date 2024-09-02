interface User {
  userId: string;
  email: string;
  password: string;
}

interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>;
}
