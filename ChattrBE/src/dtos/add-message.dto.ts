import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddMessageDto {
    @ApiProperty({ description: 'message', example: 'Bonjour' })
    @IsNotEmpty()
    message: string;

    @ApiProperty({ description: 'sender id', example: '1' })
    @IsNumber()
    senderId : number;

    @ApiProperty({ description: 'conversation id', example: '2' })
    @IsNumber()
    conversationId: number;

    @ApiProperty({ description: 'date', example: '2021-06-01' })
    @IsNotEmpty()
    timestamp: Date;
}