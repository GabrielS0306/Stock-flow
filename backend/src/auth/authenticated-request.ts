import type { Request } from 'express';
import type { JwtPayload } from './jwt-payload.js';

// Requisição depois de passar pelo JwtAuthGuard: o payload do token fica em request.user.
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
