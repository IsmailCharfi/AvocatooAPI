import { ExportCategorySimpleDto } from "src/questions/dto/export/export-category-simple.dto";

export class ExportLpDataSimpleDto {
    id: string;
    image: string;
    expertise: ExportCategorySimpleDto[]; 
}