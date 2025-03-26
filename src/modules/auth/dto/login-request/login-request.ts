import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'Email for login',
    example: 'john_doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'StrongP@ss123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
