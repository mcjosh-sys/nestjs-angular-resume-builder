namespace Express {
  export interface Request {
    user?: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      platform: string;
      email: string;
    };
  }
}
