import { comparePassword, hashPassword } from './password.js';

describe('password', () => {
  it('não guarda a senha em texto puro', async () => {
    const hashed = await hashPassword('senha-secreta');

    expect(hashed).not.toBe('senha-secreta');
    expect(hashed).toMatch(/^\$2[aby]\$10\$/);
  });

  it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
    const first = await hashPassword('senha-secreta');
    const second = await hashPassword('senha-secreta');

    expect(first).not.toBe(second);
  });

  it('aceita a senha correta e recusa a errada', async () => {
    const hashed = await hashPassword('senha-secreta');

    await expect(comparePassword('senha-secreta', hashed)).resolves.toBe(true);
    await expect(comparePassword('senha-errada', hashed)).resolves.toBe(false);
  });
});
