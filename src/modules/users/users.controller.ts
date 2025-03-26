import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { Role } from 'src/common/decorators/roles/roles.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { PaginatedResponse } from 'src/modules/shared/dto/paginated-response';
import { UserProfile } from './dto/user-profile/user-profile';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'createdAtFrom',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'createdAtTo',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
    type: PaginatedResponse<UserProfile>,
  })
  @UseGuards(AuthGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
    @Query('createdAtFrom') createdAtFrom?: string,
    @Query('createdAtTo') createdAtTo?: string,
  ): Promise<PaginatedResponse<UserProfile>> {
    return this.usersService.findAllWithPagination(page, limit, {
      search,
      ...(createdAtFrom || createdAtTo
        ? {
            createdAt: {
              startDate: createdAtFrom ? new Date(createdAtFrom) : undefined,
              endDate: createdAtTo ? new Date(createdAtTo) : undefined,
            },
          }
        : {}),
    });
  }

  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully',
    type: UserProfile,
  })
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request & { user: UserProfile }) {
    return this.usersService.findProfile(req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserProfile,
  })
  @Patch(':id/role')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async updateRole(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() body: { role: Role },
  ) {
    return this.usersService.updateRole(req.user.id, id, body.role);
  }
}
