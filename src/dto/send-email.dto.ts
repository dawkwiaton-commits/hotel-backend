import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ minLength: 3 })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[0-9+\s-]+$/)
  phone: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsString()
  dateFrom: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsString()
  dateTo: string;

  @ApiProperty({ required: false, maxLength: 500 })
  @IsOptional()
  @MaxLength(500)
  message?: string;
  
  @IsString()
  @IsNotEmpty()
  captcha: string;
}
