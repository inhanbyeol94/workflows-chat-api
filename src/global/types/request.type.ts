import { Request } from 'express';
import { Payload } from '../../core/auth/auth.type';

export interface AppRequest extends Request {
    user: Payload | null;
}
