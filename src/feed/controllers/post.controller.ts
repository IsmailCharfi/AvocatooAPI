import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, Query, UseGuards } from '@nestjs/common';
import { AbstractController, CreatedResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { GetUser } from 'src/misc/decorators/get-user.decorator';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard  } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AddPostDto } from '../dto/add-post.dto';
import { GetAllPostsDto } from '../dto/get-all-post.dto';
import { PostService } from '../services/post.service';
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController extends AbstractController{
  constructor(private readonly postService: PostService) {super()}

  @Get()
  getAllPosts(@Query() getAllPostsDto: GetAllPostsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.getAll(getAllPostsDto));
  }

  @Get("/creator/:id")
  getPostsByCreator(@Param("id") id: string, @Query() getAllPostsDto: GetAllPostsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.getPostsByCreator(id, getAllPostsDto));
  }

  @Get("/category/:id")
  getPostsByCategory(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.getPostByCategory(id));
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.postService.getPostById(id));
  }

  @HttpPost()
  @Roles(RolesEnum.ROLE_ADMIN, RolesEnum.ROLE_LP)
  @UseGuards(RoleGuard)
  addPost(@Body() addPostDto: AddPostDto, @GetUser() user: User): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.postService.addPost(addPostDto, user));
  }

  @Patch(':id')
  @Roles(RolesEnum.ROLE_ADMIN, RolesEnum.ROLE_LP)
  @UseGuards(RoleGuard)
  updatePost(@Param("id") id : string , @Body() addPostDto: AddPostDto, @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.updatePost(id, addPostDto, user));
  }

  @Delete(':id')
  @Roles(RolesEnum.ROLE_ADMIN, RolesEnum.ROLE_LP)
  @UseGuards(RoleGuard)
  deletePost(@Param("id") id : string, @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.softDeletePost(id, user));
  }

  @Patch('/restore/:id')
  @Roles(RolesEnum.ROLE_ADMIN, RolesEnum.ROLE_LP)
  @UseGuards(RoleGuard)
  restorePost(@Param("id") id : string, @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.postService.restorePost(id, user));
  }

  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  @HttpPost('/accept/:id')
  acceptPost(@Param('id') id: string): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.postService.acceptPost(id));
  }
}
