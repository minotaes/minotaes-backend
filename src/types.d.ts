declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: number;
      branchId: string;
      email: string;
      username: string;
      password: string;
      createdAt: Date;
    };
    authenticated: boolean;
  }
}
