import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/misc/crud';
import { Category } from 'src/questions/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { postDto } from './dto/post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class FeedService extends CrudService<Post> {

    constructor(@InjectRepository(Post)
                private postRepository: Repository<Post>,
                @InjectRepository(User)
                 private userRepository: Repository<User>,
                 @InjectRepository(Category)
                 private categoryRepository: Repository<Category>,
                ){
                    super(postRepository)
    }

    async addPost(postDto:postDto): Promise<Post> {
        const  {id,title,content,isAccepted}= postDto;
        const post = this.postRepository.create({id,title,content,isAccepted});
        post.lp = await (await this.userRepository.findOneBy({id})).lpData;
        return this.postRepository.save(post)
}
    
    async modifyPost(postDto:postDto): Promise<Post>{
        const  {lp,isAccepted,...data}= postDto;
        return this.postRepository.save(data);
    }

    async getAllPosts():Promise<Post[]> {
            return this.postRepository.find();
    }
    async getPostByCategory(categoryId : string):Promise<Post[]> {
        const category= await this.categoryRepository.findOne({where : {id : categoryId}})
        return this.postRepository.findBy(category);
}
  
}
