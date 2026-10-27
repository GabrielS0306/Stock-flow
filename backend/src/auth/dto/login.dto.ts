import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  // No login só exige que a senha venha preenchida: as regras de tamanho ficam no cadastro
  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'Informe a senha' })
  password: string;
}
