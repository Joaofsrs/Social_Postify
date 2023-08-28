import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationDto } from './create-publication.dto';
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
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
