import { Request } from 'express';
import { AuthPayload } from '@modules/auth/auth.type';

export interface AppRequest extends Request {
    user: AuthPayload | null;
}
