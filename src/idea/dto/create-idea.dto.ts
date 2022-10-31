import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ideaEnum } from 'src/enums';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ideaEnum.Idea)
  type: ideaEnum.Idea;
}
export class UpdateIdeaDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}
