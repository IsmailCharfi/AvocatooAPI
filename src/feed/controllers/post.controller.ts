import { Body, Controller, Get, Param,Patch,Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard  } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { postDto } from '../dto/post.dto';
import * as PostId from '../entities/post.entity';
import { PostService } from '../services/feed.service';


@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {S
  constructor(private readonly postService: PostService) {}

  @Get()
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  addPost(@Body() postDto: postDto): Promise<PostId.Post> {
    return this.postService.addPost(postDto);
  }

  @Patch(':id')
  updatePost(@Param("id") id : string , @Body() postDto: postDto): Promise<PostId.Post> {
    return this.postService.updatePost(id,postDto);
  }

  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  @Get('/accept/:id')
  acceptPost(@Param('id') id: string){
    return this.postService.acceptPost(id);
  }
}
