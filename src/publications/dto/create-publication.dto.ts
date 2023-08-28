import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePublicationDto {
    @IsNumber()
    @IsNotEmpty()
    mediaId: string;

    @IsNumber()
    @IsNotEmpty()
    postId: string;
    
    @IsDate()
    @IsNotEmpty()
    date: string;
}
