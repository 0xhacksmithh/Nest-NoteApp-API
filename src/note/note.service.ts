import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    // create logic
    const note = await this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        body: createNoteDto.body,
        userId: userId,
      },
    });

    this.logger.log(`New Note has been created: ${note.id}`);
    return note;
  }

  async findAll(
    { take, skip }: { take: number; skip: number },
    userId: number,
  ) {
    const notes = await this.prismaService.note.findMany({
      skip,
      take,
      where: {
        userId,
      },
    });
    return notes;
  }

  async findOne(id: number, userId: number) {
    const note = await this.prismaService.note.findFirst({ where: { id } });
    if (!note) {
      throw new NotFoundException('Not Found.');
    }
    if (note?.userId !== userId) {
      throw new ForbiddenException('Not Allowed');
    }
    return note;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
