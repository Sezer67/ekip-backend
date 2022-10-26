import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  chatRoomId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
