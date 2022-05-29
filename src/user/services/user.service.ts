import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Like, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from '../../auth/dto/register/register-user.dto';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { LpDataService } from './lpData.service';
import { PageDto } from 'src/misc/utils/pagination/dto/page.dto';
import { GetAllUsersDto } from '../dto/get/get-all-users.dto';
import { Paginator } from 'src/misc/utils/pagination/paginator.utils';
import { GetAllClientsDto } from '../dto/get/get-all-clients.dto';
import { GetAllAdminsDto } from '../dto/get/get-all-admins.dto';
import { GetAllLpsDto } from '../dto/get/get-all-lps.dto';
import { UpdateUserDto } from '../dto/update/update-user.dto';

@Injectable()
export class UserService {
  readonly ORDER_BY = 'firstName';
  readonly queryBuilder: SelectQueryBuilder<User>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private lpDataService: LpDataService,
  ) {
    this.queryBuilder = userRepository.createQueryBuilder();
  }

  async create(userRegisterDto: UserRegisterDto, role: RolesEnum): Promise<User> {
    const { lpData, ...userRegister } = userRegisterDto;

    const user = this.userRepository.create(userRegister);
    user.lpData = await this.lpDataService.create(lpData);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    user.role = role;

    return this.userRepository.save(user);
  }

  async getAll(getAllUsersDto: GetAllUsersDto): Promise<PageDto<User>> {
    return Paginator.paginateAndCreatePage(this.queryBuilder, getAllUsersDto, {field: this.ORDER_BY});
  }

  async getAllLps(getAllLpsDto: GetAllLpsDto): Promise<PageDto<User>> {
    this.queryBuilder
      .where('role like :role', { role: RolesEnum.ROLE_LP })
      .andWhere('lpData is not null');

    Paginator.paginate(this.queryBuilder, getAllLpsDto, {
      field: this.ORDER_BY,
    });
    return Paginator.createPage(this.queryBuilder, getAllLpsDto);
  }

  async getAllClients(getAllClientsDto: GetAllClientsDto): Promise<PageDto<User>> {
    this.queryBuilder.where('role like :role', { role: RolesEnum.ROLE_CLIENT });

    Paginator.paginate(this.queryBuilder, getAllClientsDto, {
      field: this.ORDER_BY,
    });
    return Paginator.createPage(this.queryBuilder, getAllClientsDto);
  }

  async getAllAdmins(getAllAdminsDto: GetAllAdminsDto): Promise<PageDto<User>> {
    this.queryBuilder.where('role like :role', { role: RolesEnum.ROLE_ADMIN });

    Paginator.paginate(this.queryBuilder, getAllAdminsDto, {
      field: this.ORDER_BY,
    });
    return Paginator.createPage(this.queryBuilder, getAllAdminsDto);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async getLpById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ role: RolesEnum.ROLE_LP, id });
  }

  async getClientById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({
      role: RolesEnum.ROLE_CLIENT,
      id,
    });
  }

  async getAdminById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({
      role: RolesEnum.ROLE_ADMIN,
      id,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserByResetPasswordHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { resetPasswordHash: Like(hash) },
    });
  }

  async getUserByActivationHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { activationHash: Like(hash) },
    });
  }

  async createResetPasswordHash(user: User): Promise<User> {
    const dataToHash = user.id + new Date().toDateString();
    user.resetPasswordHash = await bcrypt.hash(dataToHash, user.salt);
    user.resetPasswordSentAt = new Date();

    this.userRepository.save(user);

    return user;
  }

  async resetPassword(user: User, password: string): Promise<User> {
    user.password = await bcrypt.hash(password, user.salt);
    user.resetPasswordHash = null;
    user.resetPasswordSentAt = null;

    return this.userRepository.save(user);
  }

  async createActivationHash(user: User): Promise<User> {
    const dataToHash = user.id + new Date().toDateString() + Math.random();
    user.activationHash = await bcrypt.hash(dataToHash, user.salt);

    return this.userRepository.save(user);
  }

  async activate(id: string): Promise<SuccessReturn> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    user.isActivated = true;
    user.activationHash = null;
    this.userRepository.save(user);

    return {};
  }

  async deactivate(id: string): Promise<SuccessReturn> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    user.isActivated = false;
    this.userRepository.save(user);

    return {};
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User>{
    const { lpData, ...userUpdate } = updateUserDto;
    
    const newLpData = await this.lpDataService.update(lpData.id,  lpData);
    const newUser =  await this.userRepository.preload({id, ...userUpdate, lpData: newLpData});

    this.userRepository.save(newUser);

    delete newUser.password;
    delete newUser.salt;
    delete newUser.activationHash;
    delete newUser.resetPasswordHash;
    delete newUser.resetPasswordSentAt;

    return newUser;
  }

  async softDelete(id: string): Promise<SuccessReturn>{
    const user = await this.userRepository.findOneBy({id});
    
    if(!user) 
    throw new NotFoundException()
    
    await this.lpDataService.softDelete(user.lpData.id);
    await this.userRepository.softDelete(id);

    return {};
  }

  async restore(id: string): Promise<SuccessReturn>{
    const user = await this.userRepository.findOne({where: {id}, withDeleted: true});  
    
    if(!user) 
      throw new NotFoundException()

    await this.lpDataService.restore(user.lpData.id);
    await this.userRepository.restore(id);

    return {};
  }
}
