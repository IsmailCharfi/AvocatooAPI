import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { isAllowed } from 'src/misc/utils/isAllowed.utils';
import { PageMetaDto } from 'src/misc/utils/pagination/dto/page-meta.dto';
import { PageOptionsDto } from 'src/misc/utils/pagination/dto/page-options.dto';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { Paginator } from 'src/misc/utils/pagination/paginator.utils';
import { CategoryService } from 'src/questions/services/category.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { AddPostDto } from '../dto/add-post.dto';
import { GetAllPostsDto } from '../dto/get-all-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {

  readonly ORDER_BY = "createdAt";
  readonly ORDER_BY_ = "post.createdAt"

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  async addPost(addPostDto: AddPostDto, user: User): Promise<Post> {
    const { title, content } = addPostDto;

    const post = this.postRepository.create({ title, content });
    post.isAccepted=false;
    post.creator = await this.userService.getUserById(user.id);

    return this.postRepository.save(post);
  }

  async getAll(getAllPosts: GetAllPostsDto): Promise<PageDto<Post>> {
    const queryBuilder = this.postRepository.createQueryBuilder("post");

    queryBuilder.leftJoinAndSelect('user', 'post.creator')


    return Paginator.paginateAndCreatePage(queryBuilder, getAllPosts, {field: this.ORDER_BY_});
  }


  async getPostsByCreator(creatorId: string, getAllPosts: GetAllPostsDto): Promise<PageDto<Post>> {
    const queryBuilder = this.postRepository.createQueryBuilder();

    queryBuilder.where('creator like :creatorId', {creatorId})

    return Paginator.paginateAndCreatePage(queryBuilder, getAllPosts, {field: this.ORDER_BY});
  }

  async getPostById(id: string): Promise<Post> {
    return this.postRepository.findOneBy({id});
  }

  async getPostByCategory(categoryId: string): Promise<Post[]> {
    const category = await this.categoryService.getCategoryById(categoryId);
    return this.postRepository.findBy(category);
  }

  async updatePost(id : string, updatePostDto: UpdatePostDto, user: User ): Promise<UpdateResult> {

    const post = await this.postRepository.findOneBy({id})

    if(!post)
      throw new NotFoundException()

    if(!isAllowed(user, RolesEnum.ROLE_LP) || (user.role === RolesEnum.ROLE_LP && post.creator.id !== user.id)) 
      throw new UnauthorizedException();

    return this.postRepository.update(id, updatePostDto);
  }

  async softDeletePost(id : string, user: User ): Promise<UpdateResult> {

    const post = await this.postRepository.findOneBy({id})

    if(!post)
      throw new NotFoundException()

    if(!isAllowed(user, RolesEnum.ROLE_LP) || (user.role === RolesEnum.ROLE_LP && post.creator.id !== user.id)) 
      throw new UnauthorizedException();

    return this.postRepository.softDelete(id);
  }

  async restorePost(id : string, user: User ): Promise<UpdateResult> {

    const post = await this.postRepository.findOneBy({id})

    if(!post)
      throw new NotFoundException()

    if(!isAllowed(user, RolesEnum.ROLE_LP) || (user.role === RolesEnum.ROLE_LP && post.creator.id !== user.id)) 
      throw new UnauthorizedException();

    return this.postRepository.restore(id);
  }


  async acceptPost(id: string): Promise<UpdateResult> {
    return this.postRepository.update(id, {isAccepted: true});
  }
}
