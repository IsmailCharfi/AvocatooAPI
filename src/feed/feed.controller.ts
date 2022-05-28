import { Body, Controller, Get, Param,Post } from '@nestjs/common';
import { postDto } from './dto/post.dto';
import * as PostId from './entities/post.entity';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getAllPosts() {
    return this.feedService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.feedService.findOne(+id);
  }
  @Post('')
  registerClient(@Body() postDto: postDto): Promise<PostId.Post> {
    return this.feedService.addPost(postDto);
  }

  @Get('/accept/:id')
  acceptPost(@Param('id') id: string){
    return this.feedService.acceptPost(id);
  }
}
