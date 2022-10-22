import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  @IsString()
  followedId: string;
}
