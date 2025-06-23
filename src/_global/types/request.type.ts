import { Request } from 'express';
import { Payload } from '../../auth/auth.type';

export interface AppRequest extends Request {
    user: Payload | null;
}
