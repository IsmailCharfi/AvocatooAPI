import { Injectable, NotFoundException } from "@nestjs/common";
import { CrudService } from "../misc/crud";
import { User } from "./entities/user.entity";
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "../auth/dto/register.dto";
import * as bcrypt from "bcrypt";
import { RolesEnum } from "src/misc/enums/roles.enum";

@Injectable()
export class UserService extends CrudService<User> {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(registerDto: RegisterDto, role: RolesEnum): Promise<User> {
    const user = this.userRepository.create(registerDto);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    user.roles = [RolesEnum.ROLE_USER, role]
    return this.userRepository.save(user);
  }

  async getUserByEmail(email: string,): Promise<User> {
    return await this.userRepository.findOne({where:{ email }});
  }

  async getUserById(id: string,): Promise<User> {
    return await this.userRepository.findOne({where:{ id }});
  }

  async getUserByResetPasswordHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({where:{ resetPasswordHash: Like(hash) }});
  }

  async createResetPasswordHash(user: User): Promise<User>{
    
    const dataToHash = user.id + new Date().toDateString()
    user.resetPasswordHash = await bcrypt.hash(dataToHash, user.salt);
    user.resetPasswordSentAt = new Date()

    this.userRepository.save(user)

    return user;
  }

  async resetPassword(user: User, password:string): Promise<User>{  
    user.password = await bcrypt.hash(password, user.salt);
    user.resetPasswordHash = null;
    user.resetPasswordSentAt = null;

    return this.userRepository.save(user);
  }

  async activate(id: string) : Promise<SuccessReturn>{
    const user = await this.userRepository.findOneBy({id});
    
    if (!user) throw new NotFoundException();

    user.isActivated = true;
    this.userRepository.save(user);

    return {}
  }

  async deactivate(id: string) : Promise<SuccessReturn>{
    const user = await this.userRepository.findOneBy({id});
    
    if (!user) throw new NotFoundException();

    user.isActivated = false;
    this.userRepository.save(user);

    return {}
  }


}
