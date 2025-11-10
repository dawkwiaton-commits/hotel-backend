import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  dateFrom: string;

  @IsString()
  @IsNotEmpty()
  dateTo: string;

  @IsOptional()
  @IsString()
  message?: string;
}
