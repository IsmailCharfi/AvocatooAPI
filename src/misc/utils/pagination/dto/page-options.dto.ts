import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Order } from "src/misc/enums/order.enum";


export class PageOptionsDto {
  
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  public get skip(): number {
    return (+this.page - 1) * +this.take;
  }

}
