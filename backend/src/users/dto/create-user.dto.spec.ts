import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto.js';

// Mesmo caminho do ValidationPipe: objeto puro -> instância do DTO -> validação
async function invalidFields(body: object) {
  const errors = await validate(plainToInstance(CreateUserDto, body));
  return errors.map((error) => error.property);
}

describe('CreateUserDto', () => {
  const valid = {
    name: 'Maria',
    email: 'maria@stockflow.com',
    password: 'senha-forte',
  };

  it('aceita um usuário válido, com ou sem role', async () => {
    await expect(invalidFields(valid)).resolves.toEqual([]);
    await expect(invalidFields({ ...valid, role: 'ADMIN' })).resolves.toEqual(
      [],
    );
  });

  it('recusa corpo vazio apontando todos os campos obrigatórios', async () => {
    await expect(invalidFields({})).resolves.toEqual([
      'name',
      'email',
      'password',
    ]);
  });

  it('recusa e-mail inválido', async () => {
    await expect(
      invalidFields({ ...valid, email: 'nao-e-email' }),
    ).resolves.toEqual(['email']);
  });

  it('recusa senha com menos de 8 ou mais de 72 caracteres', async () => {
    await expect(
      invalidFields({ ...valid, password: '1234567' }),
    ).resolves.toEqual(['password']);
    await expect(
      invalidFields({ ...valid, password: 'a'.repeat(73) }),
    ).resolves.toEqual(['password']);
  });

  it('recusa papel que não existe', async () => {
    await expect(
      invalidFields({ ...valid, role: 'SUPERADMIN' }),
    ).resolves.toEqual(['role']);
  });
});
