import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common';
import { CreateContractDto, RenewContractDto, UpdateContractDto } from './dto';

@Controller('administrative-data/contracts')
export class ContractsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-contract')
  @UseInterceptors(FileInterceptor('file'))
  async createContract(@UploadedFile() file: Express.Multer.File, @Body() createContractDto: CreateContractDto) {
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
      this.client.send({ cmd: 'createContract' }, payload).pipe(
        catchError((err) => { throw new RpcException(err); }),
      ),
    );
  }

  @Get('find-all-contracts')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllContracts' }, paginationDto).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-contract/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOneContract' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch('update-contract/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContractDto: UpdateContractDto,) {
    return this.client.send({ cmd: 'updateContract' }, { ...updateContractDto, id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Delete('delete-contract/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removeContract' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch('renew-contract/:id')
  renew(@Param('id', ParseIntPipe) id: number, @Body() renewContractDto: RenewContractDto) {
    return this.client.send({ cmd: 'renewContract' }, { id, ...renewContractDto }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-contracts-by-employee/:id')
  findByEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findContractsByEmployee' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }
}
