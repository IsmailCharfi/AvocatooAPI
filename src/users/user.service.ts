import { Injectable } from "@nestjs/common";
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

  async getUserByResetPasswordHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({where:{ resetPasswordHash: Like(hash) }});
  }
}
