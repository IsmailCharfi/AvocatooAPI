import { SelectQueryBuilder } from 'typeorm';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';

export class Paginator {
    
  static paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptions: PageOptionsDto,
    orderOptions?: { field: string },
  ) {
    if (orderOptions && pageOptions.order) {
      queryBuilder.orderBy(orderOptions.field, pageOptions.order);
    }
    console.log("&&&&&&&&&&&&&&", typeof pageOptions.page)
    queryBuilder.skip(pageOptions.skip).take(pageOptions.take);
  }

  static async createPage<T>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptionsDto: PageOptionsDto,
    callbackExport?: (item: T) => any
  ): Promise<PageDto<T>> {
    const itemCount = await queryBuilder.getCount();
    let items = await queryBuilder.getMany();   
    console.log(items)
    if(callbackExport) items = items.map(callbackExport)

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(items, pageMetaDto);
  }

  static async paginateAndCreatePage<T>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptionsDto: PageOptionsDto,
    orderOptions?: { field: string },
    callbackExport?: (item: T) => any
  ): Promise<PageDto<T>> {
    Paginator.paginate(queryBuilder, pageOptionsDto, orderOptions);
    return Paginator.createPage(queryBuilder, pageOptionsDto, callbackExport);
  }
}
