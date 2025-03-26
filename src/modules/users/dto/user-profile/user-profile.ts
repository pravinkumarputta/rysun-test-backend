import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {
  @ApiProperty({
    description: 'The id of the user',
    example: '1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  emailId: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
    enum: ['admin', 'user'],
  })
  role: string;

  @ApiProperty({
    description: 'The created at date of the user',
    example: '2021-01-01',
  })
  createdAt: Date;
}
