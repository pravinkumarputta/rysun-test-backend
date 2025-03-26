import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../../common/decorators/roles/roles.enum';

export class UpdateRoleRequest {
  @ApiProperty({
    description: 'The new role for the user',
    enum: Role,
    example: Role.Admin,
  })
  @IsEnum(Role)
  role: Role;
}
