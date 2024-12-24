import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddConversationDto {
    @ApiProperty({ description: 'User who create the conversation', example: '1' })
    @IsNumber()
    createrUserId: number;

    @ApiProperty({ description: 'User to ask to have a conversation', example: '2' })
    @IsNotEmpty()
    askedUserId: number;
}