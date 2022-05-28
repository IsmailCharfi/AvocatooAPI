import { Injectable, NotFoundException } from "@nestjs/common";
import { CrudService } from "src/misc/crud.service";
import { User } from "../entities/user.entity";
import { In, IsNull, Like, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "../../auth/dto/register/register.dto";
import * as bcrypt from "bcrypt";
import { RolesEnum } from "src/misc/enums/roles.enum";
import { LpDataService } from "./lpData.service";

@Injectable()
export class UserService extends CrudService<User>{

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private lpDataService: LpDataService,
  ) {
    super(userRepository)
  }

  async create(registerDto: RegisterDto, role: RolesEnum): Promise<User> {
    const {lpData, ...userRegister} = registerDto;

    const user = this.userRepository.create(userRegister);
    user.lpData = await this.lpDataService.create(lpData);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    user.role = role;

    return this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getAllLps(): Promise<User[]> {
    return await this.userRepository.find({where:{ role: RolesEnum.ROLE_LP }});
  }

  async getAllClients(): Promise<User[]> {
    return await this.userRepository.find({where:{ role: RolesEnum.ROLE_CLIENT }});
  }

  async getAllAdmins(): Promise<User[]> {
    return await this.userRepository.find({where:{ role: RolesEnum.ROLE_ADMIN}});
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({id});
  }

  async getLpById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ role: RolesEnum.ROLE_LP, id });
  }

  async getClientById(id :string): Promise<User> {
    return await this.userRepository.findOneBy({ role: RolesEnum.ROLE_CLIENT, id });
  }

  async getAdminById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ role: RolesEnum.ROLE_ADMIN, id});
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({where:{ email }});
  }

  async getUserByResetPasswordHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({where:{ resetPasswordHash: Like(hash) }});
  }

  async getUserByActivationHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({where:{ activationHash: Like(hash) }});
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

  async createActivationHash(user: User): Promise<User>{
    
    const dataToHash = user.id + new Date().toDateString() + Math.random()
    user.activationHash = await bcrypt.hash(dataToHash, user.salt);

    return this.userRepository.save(user);
  }

  async activate(id: string) : Promise<SuccessReturn>{
    const user = await this.userRepository.findOneBy({id});
    
    if (!user) throw new NotFoundException();

    user.isActivated = true;
    user.activationHash = null;
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
