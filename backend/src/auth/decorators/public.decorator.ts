import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marca uma rota (ou um controller inteiro) como pública: o JwtAuthGuard deixa passar sem token.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
