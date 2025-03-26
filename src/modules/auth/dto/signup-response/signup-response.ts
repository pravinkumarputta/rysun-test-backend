import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/modules/users/dto/user-profile/user-profile';

export class SignupResponse {
  @ApiProperty({
    description: 'The token of the user',
    example: '1234567890',
  })
  token: string;

  @ApiProperty({
    description: 'The user profile of the user',
    example: {
      id: '1234567890',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      role: 'admin',
    },
  })
  userProfile: UserProfile;
}
