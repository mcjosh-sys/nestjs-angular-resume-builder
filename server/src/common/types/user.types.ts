import { Request } from 'express';

export type User = NonNullable<Request['user']>;
