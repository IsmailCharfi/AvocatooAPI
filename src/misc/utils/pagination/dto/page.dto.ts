import { IsArray } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
  @IsArray()
  readonly pageData: T[];

  readonly meta: PageMetaDto;

  constructor(pageData: T[], meta: PageMetaDto) {
    this.pageData = pageData;
    this.meta = meta;
  }
}
  