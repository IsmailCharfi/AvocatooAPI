import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IsNull, Like, Not, Repository, UpdateResult } from 'typeorm';
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
import { ExportUserSimpleDto } from '../dto/export/export-user-simple.dto';
import { PageMetaDto } from 'src/misc/utils/pagination/dto/page-meta.dto';
import { PageOptionsDto } from 'src/misc/utils/pagination/dto/page-options.dto';

@Injectable()
export class UserService {
  readonly ORDER_BY = 'firstName';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private lpDataService: LpDataService,
  ) {}

  async create(userRegisterDto: UserRegisterDto, role: RolesEnum, image?: Express.Multer.File): Promise<User> {
    const { lpData, ...userRegister } = userRegisterDto;

    const user = this.userRepository.create(userRegister);

    user.lpData = await this.lpDataService.create(lpData, image);

    user.salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, user.salt);
    user.role = role;

    return this.userRepository.save(user);
  }

  async getAll(getAllUsersDto: GetAllUsersDto): Promise<PageDto<ExportUserSimpleDto>> {
    let where;
    if(getAllUsersDto.search)
      where = [
        {firstName: Like(`%${getAllUsersDto.search}%`)},
        {lastName: Like(`%${getAllUsersDto.search}%`)},
        {email: Like(`%${getAllUsersDto.search}%`)}
      ]

    let [items, itemCount] =  await this.userRepository.findAndCount({
      relations: ["lpData"],
      join: {
        alias: "user",
        leftJoinAndSelect: {
          lpData: 'user.lpData'
        }
      },
      ...( getAllUsersDto .search ? {where} : {}),
      skip: getAllUsersDto.skip,
      take: getAllUsersDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getAllUsersDto as PageOptionsDto,
    });

    return new PageDto(items.map(item => item.exportUserSimple()), pageMetaDto);
      }

  async getAllLps(getAllLpsDto: GetAllLpsDto): Promise<PageDto<ExportUserSimpleDto>> {

    const where = {role: RolesEnum.ROLE_LP, lpData: Not(IsNull())}

    let [items, itemCount] =  await this.userRepository.findAndCount({
      relations: ["lpData"],
      join: {
        alias: "user",
        leftJoinAndSelect: {
          lpData: 'user.lpData'
        }
      },
      ...( getAllLpsDto.search ? {where} : {}),
      skip: getAllLpsDto.skip,
      take: getAllLpsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getAllLpsDto as PageOptionsDto,
    });

    return new PageDto(items.filter(item => item.role === RolesEnum.ROLE_LP).map(item => item.exportUserSimple()), pageMetaDto);

    //return Paginator.paginateAndCreatePage(queryBuilder, getAllLpsDto, {field: this.ORDER_BY,}, (item: User) => item.exportUserSimple());
  }

  async getAllClients(getAllClientsDto: GetAllClientsDto): Promise<PageDto<User>> {

    const queryBuilder = this.userRepository.createQueryBuilder();

    queryBuilder.where('role like :role', { role: RolesEnum.ROLE_CLIENT });

    return Paginator.paginateAndCreatePage(queryBuilder, getAllClientsDto, {field: this.ORDER_BY,}, (item: User) => item.exportUserSimple());
  }

  async getAllAdmins(getAllAdminsDto: GetAllAdminsDto): Promise<PageDto<User>> {

    const queryBuilder = this.userRepository.createQueryBuilder();

    queryBuilder.where('role like :role', { role: RolesEnum.ROLE_ADMIN });

    return Paginator.paginateAndCreatePage(queryBuilder, getAllAdminsDto, {field: this.ORDER_BY,}, (item: User) => item.exportUserSimple());
  }

  async getUserById(id: string): Promise<User> {
    const user =  await this.userRepository.findOneBy({ id });

    return user
  }

  async getLpById(id: string): Promise<ExportUserSimpleDto> {
    const lp = await this.userRepository.findOneBy({ role: RolesEnum.ROLE_LP, id });

    return lp.exportUserSimple()
  }

  async getClientById(id: string): Promise<ExportUserSimpleDto> {
    const client =  await this.userRepository.findOneBy({
      role: RolesEnum.ROLE_CLIENT,
      id,
    });

    return client.exportUserSimple()
  }

  async getAdminById(id: string): Promise<ExportUserSimpleDto> {
    const admin =  await this.userRepository.findOneBy({
      role: RolesEnum.ROLE_ADMIN,
      id,
    });
    return admin.exportUserSimple()
  }

  async getUserByEmail(email: string): Promise<User> {
    return (await this.userRepository.findOne({ where: { email } }));
  }

  async getUserByResetPasswordHash(hash: string): Promise<User> {
    return (await this.userRepository.findOne({
      where: { resetPasswordHash: Like(hash) },
    }));
  }

  async getUserByActivationHash(hash: string): Promise<User> {
    return (await this.userRepository.findOne({
      where: { activationHash: Like(hash) },
    }));
  }

  async createResetPasswordHash(user: User): Promise<User> {
    const dataToHash = user.id + new Date().toDateString();
    user.resetPasswordHash = await bcrypt.hash(dataToHash, user.salt);
    user.resetPasswordSentAt = new Date();

    return this.userRepository.save(user);
  }

  async resetPassword(user: User, password: string): Promise<User> {
    user.password = await bcrypt.hash(password, user.salt);
    user.resetPasswordHash = null;
    user.resetPasswordSentAt = null;

    return (await this.userRepository.save(user));
  }

  async createActivationHash(user: User): Promise<User> {
    const dataToHash = user.id + new Date().toDateString() + Math.random();
    user.activationHash = await bcrypt.hash(dataToHash, user.salt);

    return (await this.userRepository.save(user));
  }

  async activate(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    user.isActivated = true;
    user.activationHash = null;
    ;

    return (await this.userRepository.save(user));
  }

  async deactivate(id: string): Promise<ExportUserSimpleDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    user.isActivated = false;
    return (await this.userRepository.save(user)).exportUserSimple();
  }

  async update(id: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<ExportUserSimpleDto>{
    let { lpData, ...userUpdate } = updateUserDto;
    
    const newLpData = lpData ? await this.lpDataService.update(lpData.id, lpData, file) : null;
    const newUser =  await this.userRepository.preload({id, ...userUpdate, ...(newLpData ? {lpData: newLpData} : {} )});

    this.userRepository.save(newUser);

    delete newUser.password;
    delete newUser.salt;
    delete newUser.activationHash;
    delete newUser.resetPasswordHash;
    delete newUser.resetPasswordSentAt;

    return newUser.exportUserSimple();
  }

  async softDelete(id: string): Promise<UpdateResult>{
    const user = await this.userRepository.findOneBy({id});
    
    if(!user) 
    throw new NotFoundException()
    
    if(user.lpData) await this.lpDataService.softDelete(user.lpData.id);
    return await this.userRepository.softDelete(id);

  }

  async restore(id: string): Promise<UpdateResult>{
    const user = await this.userRepository.findOne({where: {id}, withDeleted: true});  
    
    if(!user) 
      throw new NotFoundException()

    await this.lpDataService.restore(user.lpData.id);
    return await this.userRepository.restore(id);
  }

  async changeStateToOnline(user: User): Promise<User> {
    user.isOnline = true;
    user = await this.userRepository.save(user);
    //notify
    return user;
  }

  async changeStateToOffline(user: User): Promise<User> {
    user.isOnline = false;
    user =  await this.userRepository.save(user);
    //notify
    return user;
  }
}
