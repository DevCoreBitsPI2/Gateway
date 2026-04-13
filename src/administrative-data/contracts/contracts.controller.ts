import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateContractDto, UpdateContractDto } from './dto';

@Controller('administrative-data/contracts')
export class ContractsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-contract')
  @UseInterceptors(FileInterceptor('file'))
  async createContract(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContractDto: CreateContractDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const payload = {
      ...createContractDto,
      bufferBase64: file.buffer.toString('base64'),
      mimetype: file.mimetype,
      originalname: file.originalname,
      fieldname: file.fieldname,
      encoding: file.encoding,
    };

    return firstValueFrom(
      this.client.send({cmd:'createContract'}, payload)
      .pipe(
      catchError((err) => { throw new RpcException(err); }),
    ));
  }

  @Get()
  findAll() {
    return this.client.send('findAllContracts', {}).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('findOneContract', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.client.send('updateContract', { ...updateContractDto, id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('removeContract', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }
}
