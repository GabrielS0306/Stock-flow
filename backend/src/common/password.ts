import { compare, hash } from 'bcryptjs';

// Custo do bcrypt: o hash é refeito 2^10 vezes.
// Quanto maior, mais lento para um atacante testar senhas (e para o login também).
const SALT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

export function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return compare(plain, hashed);
}
