import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesEnum } from "src/misc/enums/roles.enum";
import { isAllowed } from "src/misc/utils/isAllowed.utils";
import { PageDto } from "src/misc/utils/pagination/dto/page.dto";
import { Paginator } from "src/misc/utils/pagination/paginator.utils";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/services/user.service";
import { Repository, UpdateResult } from "typeorm";
import { AddTicketDto } from "../dto/ticket/add-ticket.dto";
import { GetAllTicketsDto } from "../dto/ticket/get-all-tickets.dto";
import { Ticket } from "../entities/ticket.entity";
import { QuestionService } from "./question.service";

export class TicketService{

  readonly ORDER_BY: string = "createdAt"

  constructor(
      @InjectRepository(Ticket)
      private ticketRepository: Repository<Ticket>,
      private questionService: QuestionService,
      private userService: UserService
  ) {}

  async getAll(getAllTicketsDto: GetAllTicketsDto): Promise<PageDto<Ticket>> {
    const queryBuilder = this.ticketRepository.createQueryBuilder();

    return Paginator.paginateAndCreatePage(queryBuilder, getAllTicketsDto, {field: this.ORDER_BY})
  }

  async getTicketsByQuestion(id: string, getAllTicketsDto: GetAllTicketsDto): Promise<PageDto<Ticket>> {
      const queryBuilder = this.ticketRepository.createQueryBuilder();

      queryBuilder.where('question like :id', {id})

      return Paginator.paginateAndCreatePage(queryBuilder, getAllTicketsDto, {field: this.ORDER_BY})
  }

  async getTicketsByClient(id: string, getAllTicketsDto: GetAllTicketsDto): Promise<PageDto<Ticket>> {
    const queryBuilder = this.ticketRepository.createQueryBuilder();

    queryBuilder
      .innerJoin('question', 'q', 'question like q.id')
      .where('q.client = :id', {id})

    return Paginator.paginateAndCreatePage(queryBuilder, getAllTicketsDto, {field: this.ORDER_BY})
  }

  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await  this.ticketRepository.findOneBy({id});

    if(!ticket)
      throw new NotFoundException()

    return ticket;
  }

  async openTicket(addTicketDto: AddTicketDto): Promise<Ticket> {

    const question = await this.questionService.getQuestionById(addTicketDto.question);
    const lp = await this.userService.getLpById(addTicketDto.lp)
    const ticket = this.ticketRepository.create({ question, lp, closed: false})

    return this.ticketRepository.save(ticket);
  }

  async closeTicket(id: string, user: User): Promise<UpdateResult> {
    const ticket = await this.ticketRepository.findOneBy({id});

    if (!ticket) 
      throw new NotFoundException()

    if (!isAllowed(user, RolesEnum.ROLE_CLIENT, RolesEnum.ROLE_LP) || (user.role == RolesEnum.ROLE_CLIENT && ticket.question.client.id !== user.id))
      throw new UnauthorizedException()

      ticket.closed = true;
      ticket.closedAt = new Date();

    return this.ticketRepository.update(ticket.id, ticket)
  }

  async softDelete(id: string): Promise<UpdateResult> {
    const result =  await this.ticketRepository.softDelete(id)
    if (result.affected === 0) 
      throw new NotFoundException()

    return result

  }

  async restore(id: string): Promise<UpdateResult> {
    const result =  await this.ticketRepository.restore(id)
    if (result.affected === 0) 
      throw new NotFoundException()

    return result
  }

}