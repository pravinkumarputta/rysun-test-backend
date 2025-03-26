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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { Role } from 'src/common/decorators/roles/roles.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { PaginatedResponse } from 'src/modules/shared/dto/paginated-response';
import { UpdateRoleRequest } from './dto/update-role-request';
import { UserProfile } from './dto/user-profile/user-profile';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for user name or email',
  })
  @ApiQuery({
    name: 'createdAtFrom',
    required: false,
    type: String,
    description: 'Filter users created after this date',
  })
  @ApiQuery({
    name: 'createdAtTo',
    required: false,
    type: String,
    description: 'Filter users created before this date',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of users',
    type: PaginatedResponse<UserProfile>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
  })
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

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get the current user's profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the current user's profile",
    type: UserProfile,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  async getProfile(@Req() req: Request & { user: UserProfile }) {
    return this.usersService.findProfile(req.user.id);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: "Update a user's role" })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserProfile,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateRole(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() body: UpdateRoleRequest,
  ) {
    return this.usersService.updateRole(req.user.id, id, body.role);
  }
}
