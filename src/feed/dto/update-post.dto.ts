import { PartialType } from "@nestjs/mapped-types";
import { AddPostDto } from "./add-post.dto";

export class UpdatePostDto extends PartialType(AddPostDto) {}
  
  