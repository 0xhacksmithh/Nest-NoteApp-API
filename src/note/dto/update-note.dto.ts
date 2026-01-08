// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; // for swagger use
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
