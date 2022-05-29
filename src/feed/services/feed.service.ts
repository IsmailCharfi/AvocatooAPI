import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/questions/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { postDto } from '../dto/post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService  {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
  }

  async addPost(postDto: postDto): Promise<Post> {
    const { user, title, content } = postDto;
    const post = this.postRepository.create({ title, content });
    post.isAccepted=false;
    post.user = await this.userRepository.findOneBy({ id: user });
    return this.postRepository.save(post);
  }

  async updatePost(id : string,postDto: postDto ): Promise<Post> {
    const { user, ...data } = postDto;
    return this.postRepository.save({id , ...data});
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }
  async getPostByCategory(categoryId: string): Promise<Post[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    return this.postRepository.findBy(category);
  }
  async getPostById(id: string): Promise<Post[]> {
    return this.postRepository.findBy({id});
  }
  async acceptPost(categoryId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: categoryId },
    });
    post.isAccepted = true;
    return this.postRepository.save(post);
  }
}
