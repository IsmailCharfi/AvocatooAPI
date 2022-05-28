import { Body, Controller, Get, Param,Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard  } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { postDto } from '../dto/post.dto';
import * as PostId from '../entities/post.entity';
import { FeedService } from '../services/feed.service';


@UseGuards(JwtAuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getAllPosts() {
    return this.feedService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.feedService.findOne(id);
  }

  @Post()
  registerClient(@Body() postDto: postDto): Promise<PostId.Post> {
    return this.feedService.addPost(postDto);
  }

  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  @Get('/accept/:id')
  acceptPost(@Param('id') id: string){
    return this.feedService.acceptPost(id);
  }
}
