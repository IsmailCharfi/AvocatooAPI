import { PartialType } from "@nestjs/mapped-types";
import { AddTicketDto } from "./add-ticket.dto";

export class UpdateTicketDto extends PartialType(AddTicketDto) {}
  