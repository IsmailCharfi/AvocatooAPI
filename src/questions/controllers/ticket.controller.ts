import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { AbstractController, CreatedResponse, SuccessResponse } from 'src/misc/abstracts/abstract.controller';
import { GetUser } from 'src/misc/decorators/get-user.decorator';
import { Roles } from 'src/misc/decorators/role.decorator';
import { RolesEnum } from 'src/misc/enums/roles.enum';
import { JwtAuthGuard } from 'src/misc/guards/authentication.guard';
import { RoleGuard } from 'src/misc/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AddTicketDto } from '../dto/ticket/add-ticket.dto';
import { GetAllTicketsDto } from '../dto/ticket/get-all-tickets.dto';
import { TicketService } from '../services/ticket.service';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController extends AbstractController{
  constructor(private readonly ticketService: TicketService) {super()}

  @Get()
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  getAllTickets(@Body() getAllTicketsDto: GetAllTicketsDto): Promise<SuccessResponse>{
    return this.renderSuccessResponse(this.ticketService.getAll(getAllTicketsDto));
  }

  @Get('/client/:id')
  getTicketsByClient(@Param("id") id: string, @Body() getAllTicketsDto: GetAllTicketsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.ticketService.getTicketsByClient(id, getAllTicketsDto));
  }

  @Get('/question/:id')
  getTicketsByQuestion(@Param("id") id: string, @Body() getAllTicketsDto: GetAllTicketsDto): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.ticketService.getTicketsByQuestion(id, getAllTicketsDto));
  }

  @Post()
  openTicket(@Body() addTicketDto: AddTicketDto): Promise<CreatedResponse> {
    return this.renderCreatedResponse(this.ticketService.openTicket(addTicketDto));
  }

  @Post('/:id')
  closeTicket(@Param("id") id: string, @GetUser() user: User): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.ticketService.closeTicket(id, user));
  }

  @Delete('/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  deleteTicket(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.ticketService.softDelete(id));
  }

  @Patch('/restore/:id')
  @Roles(RolesEnum.ROLE_ADMIN)
  @UseGuards(RoleGuard)
  restoreTicket(@Param("id") id: string): Promise<SuccessResponse> {
    return this.renderSuccessResponse(this.ticketService.restore(id));
  }

}
