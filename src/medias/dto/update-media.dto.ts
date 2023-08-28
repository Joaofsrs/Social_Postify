import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}
