import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/client.js';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'Informe o nome' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  // O bcrypt só considera os primeiros 72 bytes da senha; acima disso o resto seria ignorado
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'O papel deve ser ADMIN ou OPERATOR' })
  role?: Role;
}
